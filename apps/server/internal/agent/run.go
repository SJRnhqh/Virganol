package agent

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"time"

	"virganol/server/internal/lifecycle"
)

// Config holds runtime options for the agent server.
type Config struct {
	// Addr is the TCP listen address, e.g. "127.0.0.1:0" for an ephemeral port.
	Addr string
	// ShutdownTimeout is the upper bound for graceful shutdown duration.
	// If zero or negative, a default (20s) is applied.
	ShutdownTimeout time.Duration
}

// Run starts the agent gRPC server, blocks until ctx is cancelled, and then
// performs a graceful shutdown with timeout fallback.
func Run(ctx context.Context, cfg Config) error {
	if cfg.Addr == "" {
		cfg.Addr = "127.0.0.1:0"
	}

	// 1) Listen
	lis, err := net.Listen("tcp", cfg.Addr)
	if err != nil {
		return fmt.Errorf("listen %s: %w", cfg.Addr, err)
	}

	// 2) Build server and register services
	grpcServer := NewGRPCServer()
	RegisterGRPC(grpcServer, NewService())

	// 3) Start serving
	go func() {
		log.Printf("🚀 Go Agent listening at %v", lis.Addr())
		if err := grpcServer.Serve(lis); err != nil {
			// Avoid fatal here; main goroutine controls shutdown flow.
			log.Printf("⚠️ Server stopped unexpected: %v", err)
		}
	}()

	// 4) Expose port for parent process discovery (stdout)
	if tcp, ok := lis.Addr().(*net.TCPAddr); ok {
		fmt.Printf("VIRGANOL_PORT=%d\n", tcp.Port)
		_ = os.Stdout.Sync()
	}

	// 5) Wait for shutdown signal
	<-ctx.Done()
	log.Println("🛑 Shutting down server...")

	// 6) Graceful shutdown with timeout fallback
	timeout := cfg.ShutdownTimeout
	if timeout <= 0 {
		timeout = 20 * time.Second
	}
	sdCtx, cancel := lifecycle.WithShutdownTimeout(context.Background(), timeout)
	defer cancel()

	timedOut := lifecycle.RunWithTimeout(sdCtx, func() {
		// GracefulStop stops accepting new connections and waits for inflight RPCs.
		grpcServer.GracefulStop()
	})
	if timedOut {
		log.Println("⏱️ Graceful shutdown timed out; forcing stop")
		grpcServer.Stop()
	}

	_ = lis.Close()
	log.Println("👋 Server exited gracefully")
	return nil
}
