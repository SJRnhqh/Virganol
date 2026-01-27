// apps/server/internal/agent/server.go
package agent

import (
	// 外部依赖
	grpc "google.golang.org/grpc"
	reflection "google.golang.org/grpc/reflection"

	// 内部引用
	pb "virganol/server/proto/virganol/v1"
)

// NewGRPCServer creates a gRPC server with the provided options.
// Add interceptors, keepalive parameters, message size limits, etc., via opts.
//
// Example:
//
//	s := NewGRPCServer(
//	    grpc.MaxRecvMsgSize(8 << 20), // 8MB
//	    grpc.MaxSendMsgSize(8 << 20),
//	)
func NewGRPCServer(opts ...grpc.ServerOption) *grpc.Server {
	s := grpc.NewServer(opts...)
	// Enable gRPC Server Reflection in development for tools like grpcurl/grpcui.
	// In production, consider gating this with a build tag or env flag.
	reflection.Register(s)
	return s
}

// RegisterGRPC registers all Agent-related gRPC services to the given server.
// Extend here when adding more services under the agent domain.
func RegisterGRPC(s *grpc.Server, svc *Service) {
	pb.RegisterAgentServiceServer(s, svc)
}
