// apps/server/internal/agent/run.go
package agent

import (
	// 外部依赖
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"time"

	// 内部引用
	lifecycle "virganol/server/internal/lifecycle"
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

	grpcServer := NewGRPCServer()
	// Health manager for liveness/readiness
	hm := NewHealthManager()
	hm.Register(grpcServer)
	svc := NewService()
	RegisterGRPC(grpcServer, svc)
	// Mark overall and Agent service as SERVING before accepting calls
	hm.SetOverallServing()
	hm.SetAgentServing()

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

	// 5) Wait for shutdown signal (OS signal OR gRPC Shutdown request)
	// 同时监听两种关闭信号：
	// - ctx.Done(): 来自操作系统的信号 (SIGINT/SIGTERM)
	// - svc.ShutdownChan(): 来自 Rust 端的 gRPC Shutdown 请求
	select {
	case <-ctx.Done():
		log.Println("🛑 Shutdown triggered by OS signal")
	case <-svc.ShutdownChan():
		log.Println("🛑 Shutdown triggered by gRPC request from Rust")
	}
	log.Println("🛑 Shutting down server...")

	// 6) Graceful shutdown with timeout fallback
	timeout := cfg.ShutdownTimeout
	if timeout <= 0 {
		timeout = 20 * time.Second
	}
	sdCtx, tcCancel := lifecycle.WithShutdownTimeout(context.Background(), timeout)
	// 释放计时的资源 & 取消计时关闭上下文
	defer tcCancel()

	timedOut := lifecycle.RunWithTimeout(sdCtx, func() {

		// Mark NOT_SERVING before draining connections, then graceful stop.
		// GracefulStop stops accepting new connections and waits for inflight RPCs.

		hm.Shutdown()
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
