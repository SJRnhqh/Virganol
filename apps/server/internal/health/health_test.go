// apps/server/internal/health/health_test.go
// TODO: 保留健康检查的测试文件，后续再重构
package health

import (
	// 外部依赖
	"context"
	"net"
	"testing"
	"time"

	grpc "google.golang.org/grpc"
	insecure "google.golang.org/grpc/credentials/insecure"
	healthpb "google.golang.org/grpc/health/grpc_health_v1"

	// 内部引用
	grpcserver "virganol/server/internal/grpcserver"
)

// TestHealthLivenessAndServiceStatus spins up a minimal gRPC server with the
// built-in health service, verifies overall (liveness) and per-service statuses,
// then flips them to NOT_SERVING and verifies the changes are observable via RPC.
func TestHealthLivenessAndServiceStatus(t *testing.T) {
	// 1) Start a TCP listener on an ephemeral port
	lis, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	defer lis.Close()

	// 2) Build gRPC server and register health
	s := grpcserver.NewgRPCServer()
	hm := NewHealthManager()
	hm.Register(s)

	// Mark both overall and Agent as SERVING before accepting calls
	hm.SetOverallServing()
	hm.SetAgentServing()

	// Start serving
	serveErr := make(chan error, 1)
	go func() {
		serveErr <- s.Serve(lis)
	}()

	// 3) Create client connection (non-blocking dial; rely on RPC timeout)
	addr := lis.Addr().String()
	conn, err := grpc.NewClient(
		addr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		t.Fatalf("new client: %v", err)
	}
	defer conn.Close()

	hc := healthpb.NewHealthClient(conn)

	// 4) Verify initial SERVING states
	assertHealthStatus(t, hc, "", healthpb.HealthCheckResponse_SERVING)                         // overall
	assertHealthStatus(t, hc, "virganol.v1.AgentService", healthpb.HealthCheckResponse_SERVING) // service

	// 5) Flip Agent to NOT_SERVING and verify
	hm.SetAgentNotServing()
	assertHealthStatus(t, hc, "virganol.v1.AgentService", healthpb.HealthCheckResponse_NOT_SERVING)

	// 6) Flip overall to NOT_SERVING and verify
	hm.SetOverallNotServing()
	assertHealthStatus(t, hc, "", healthpb.HealthCheckResponse_NOT_SERVING)

	// 7) Cleanup server
	s.Stop()

	// Ensure serve returns without error (Serve returns nil on GracefulStop/Stop)
	select {
	case err := <-serveErr:
		if err != nil {
			t.Fatalf("grpc Serve returned error: %v", err)
		}
	case <-time.After(2 * time.Second):
		t.Fatalf("grpc server did not stop in time")
	}
}

func assertHealthStatus(t *testing.T, hc healthpb.HealthClient, service string, want healthpb.HealthCheckResponse_ServingStatus) {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	resp, err := hc.Check(ctx, &healthpb.HealthCheckRequest{Service: service})
	if err != nil {
		t.Fatalf("health Check(%q) error: %v", service, err)
	}
	if resp.Status != want {
		t.Fatalf("health Check(%q) = %v, want %v", service, resp.Status, want)
	}
}
