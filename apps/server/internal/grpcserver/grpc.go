// apps/server/internal/grpcserver/grpc.go
package grpcserver

import (
	// 外部依赖
	grpc "google.golang.org/grpc"
	reflection "google.golang.org/grpc/reflection"
)

// 创建gRPC服务
func NewgRPCServer(opts ...grpc.ServerOption) *grpc.Server {
	s := grpc.NewServer(opts...)
	reflection.Register(s)
	return s
}
