// apps/server/internal/agent/service.go
package agent

import (
	// 外部依赖
	"context"
	"log"
	"time"

	// 内部引用
	pb "virganol/server/proto/virganol/v1"
)

// Service implements the Agent gRPC API.
type Service struct {
	pb.UnimplementedAgentServiceServer
	shutdownCh chan struct{}
}

// NewService constructs the Agent service.
func NewService() *Service {
	return &Service{
		shutdownCh: make(chan struct{}, 1),
	}
}

// ShutdownChan 返回关闭信号通道，供 run.go 监听
func (s *Service) ShutdownChan() <-chan struct{} {
	return s.shutdownCh
}

// Ping is a simple connectivity test method.
func (s *Service) Ping(ctx context.Context, in *pb.PingRequest) (*pb.PingResponse, error) {
	log.Printf("📥 Received: %s", in.GetMessage())
	return &pb.PingResponse{
		Reply:     "Pong from Go: " + in.GetMessage(),
		Timestamp: time.Now().Unix(),
	}, nil
}

// Shutdown 处理来自 Rust 端的优雅关闭请求
func (s *Service) Shutdown(ctx context.Context, in *pb.ShutdownRequest) (*pb.ShutdownResponse, error) {
	log.Printf("🛑 Received Shutdown request (timeout_ms=%d)", in.GetTimeoutMs())

	// 发送关闭信号（非阻塞）
	select {
	case s.shutdownCh <- struct{}{}:
		log.Println("📤 Shutdown signal sent")
	default:
		// 通道已满，说明已经在关闭中
		log.Println("⚠️ Shutdown already in progress")
	}

	return &pb.ShutdownResponse{
		Acknowledged: true,
	}, nil
}

// Compile-time assertion that Service implements the interface.
var _ pb.AgentServiceServer = (*Service)(nil)
