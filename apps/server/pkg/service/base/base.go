// apps/server/pkg/service/base/base.go
package base

import (
	// 外部依赖
	"context"
	"log"
	"time"

	// 内部引用
	pb "virganol/server/proto/virganol/v1"
)

// BaseService结构体
type BaseService struct {
	pb.UnimplementedBaseServiceServer
	shutdownCh chan struct{}
}

// NewBaseService 创建一个新的BaseService实例
func NewBaseService() *BaseService {
	return &BaseService{
		shutdownCh: make(chan struct{}, 1),
	}
}

// ShutdownChan 返回BaseService的关闭信号通道
func (s *BaseService) ShutdownChan() <-chan struct{} {
	return s.shutdownCh
}

// Ping
func (s *BaseService) Ping(ctx context.Context, in *pb.PingRequest) (*pb.PingResponse, error) {
	log.Printf("📥 Received: %s", in.GetMessage())
	return &pb.PingResponse{
		Reply:     "Pong from Go: " + in.GetMessage(),
		Timestamp: time.Now().Unix(),
	}, nil
}

// Shutdown 处理来自 Rust 端的优雅关闭请求
func (s *BaseService) Shutdown(ctx context.Context, in *pb.ShutdownRequest) (*pb.ShutdownResponse, error) {
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

// 编译断言实现了pb.BaseServiceServer接口
var _ pb.BaseServiceServer = (*BaseService)(nil)
