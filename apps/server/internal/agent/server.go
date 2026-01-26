package agent

import (
	pb "virganol/server/proto/virganol/v1"

	"google.golang.org/grpc"
)

// NewGRPCServer creates a gRPC server with the provided options.
// Add interceptors, keepalive parameters, message size limits, etc., via opts.
//
// Example:
//   s := NewGRPCServer(
//       grpc.MaxRecvMsgSize(8 << 20), // 8MB
//       grpc.MaxSendMsgSize(8 << 20),
//   )
func NewGRPCServer(opts ...grpc.ServerOption) *grpc.Server {
	return grpc.NewServer(opts...)
}

// RegisterGRPC registers all Agent-related gRPC services to the given server.
// Extend here when adding more services under the agent domain.
func RegisterGRPC(s *grpc.Server, svc *Service) {
	pb.RegisterAgentServiceServer(s, svc)
}
