// apps/server/internal/grpcserver/run.go
package grpcserver

import (
	// 外部依赖
	"context"
	"fmt"
	"log"
	"net"
	"os"

	// 内部引用
	lifecycle "virganol/server/internal/lifecycle"
	constant "virganol/server/pkg/common/constant"
)

// 启动和管理gRPC完整生命周期
func Run(ctx context.Context) error {

	// 1) 监听
	lis, err := net.Listen("tcp", constant.GRPC_ADDR)
	if err != nil {
		return fmt.Errorf("listen %s: %w", constant.GRPC_ADDR, err)
	}

	// 2) 创建gRPC服务器并且注册服务
	grpcServer := NewgRPCServer()
	handles := RegisterServices(grpcServer)
	// Health manager for liveness/readiness
	// hm := NewHealthManager()
	// hm.Register(grpcServer)
	// Mark overall and Agent service as SERVING before accepting calls
	// hm.SetOverallServing()
	// hm.SetAgentServing()

	// 3) 启动服务
	go func() {
		log.Printf("🚀 Go Agent listening at %v", lis.Addr())
		if err := grpcServer.Serve(lis); err != nil {
			// Avoid fatal here; main goroutine controls shutdown flow.
			log.Printf("⚠️ Server stopped unexpected: %v", err)
		}
	}()

	// 4) 端口暴露给父进程
	if tcp, ok := lis.Addr().(*net.TCPAddr); ok {
		fmt.Printf("VIRGANOL_PORT=%d\n", tcp.Port)
		_ = os.Stdout.Sync()
	}

	// 5) 同时监听两种关闭信号：
	// - ctx.Done(): 来自操作系统的信号 (SIGINT/SIGTERM)
	// - svc.ShutdownChan(): 来自 Rust 端的 gRPC Shutdown 请求
	select {
	case <-ctx.Done():
		log.Println("🛑 Shutdown triggered by OS signal")
	case <-handles.ShutdownCh:
		log.Println("🛑 Shutdown triggered by gRPC request from Rust")
	}
	log.Println("🛑 Shutting down server...")

	// 6) 等待超时后强制关闭
	sdCtx, tcCancel := lifecycle.WithShutdownTimeout(context.Background(), constant.GRPC_SHUTDOWN_TIMEOUT)
	// 释放计时的资源 & 取消计时关闭上下文
	defer tcCancel()

	timedOut := lifecycle.RunWithTimeout(sdCtx, func() {

		// Mark NOT_SERVING before draining connections, then graceful stop.
		// GracefulStop stops accepting new connections and waits for inflight RPCs.

		// hm.Shutdown()
		grpcServer.GracefulStop()

	})

	if timedOut {
		log.Println("⏱️ Graceful shutdown timed out; forcing stop")
		grpcServer.Stop()
	}

	// 7) 关闭监听，优雅退出
	_ = lis.Close()
	log.Println("👋 Server exited gracefully")
	return nil
}
