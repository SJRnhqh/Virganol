// apps/server/cmd/agent/main.go
package main

import (
	// 外部依赖
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"time"

	grpc "google.golang.org/grpc"

	// 内部引用
	pb "virganol/server/proto/virganol/v1"
)

// server 结构体需要实现 AgentServiceServer 接口
// 必须继承 UnimplementedAgentServiceServer 以保证向前兼容
type server struct {
	pb.UnimplementedAgentServiceServer
}

// Ping 实现我们在 proto 里定义的接口
func (s *server) Ping(ctx context.Context, in *pb.PingRequest) (*pb.PingResponse, error) {
	log.Printf("📥 Received: %v", in.GetMessage())

	// 返回一个 Pong
	return &pb.PingResponse{
		Reply:     "Pong from Go: " + in.GetMessage(),
		Timestamp: time.Now().Unix(),
	}, nil
}

func main() {
	// 1. 监听本地随机端口
	// "127.0.0.1:0" 中的 0 表示让操作系统自动分配一个空闲端口
	lis, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	// 2. 获取系统实际分配的端口号
	port := lis.Addr().(*net.TCPAddr).Port

	// 3. 【核心握手】打印端口号给 Rust 看
	// 格式必须严格匹配 Rust 端解析的字符串 "VIRGANOL_PORT="
	fmt.Printf("VIRGANOL_PORT=%d\n", port)

	// 这一步非常重要！强制刷新标准输出，确保 Rust 能立刻读到这一行
	// 如果不加，可能会因为缓冲区未满而卡住
	os.Stdout.Sync()

	// 4. 创建 gRPC 服务器
	s := grpc.NewServer()

	// 5. 注册我们的服务
	pb.RegisterAgentServiceServer(s, &server{})

	log.Printf("🚀 Go Agent listening at %v", lis.Addr())

	// 6. 启动服务（阻塞运行）
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
