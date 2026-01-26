package agent

import (
	"context"
	"log"
	"time"

	pb "virganol/server/proto/virganol/v1"
)

// Service implements the Agent gRPC API.
type Service struct {
	pb.UnimplementedAgentServiceServer
}

// NewService constructs the Agent service.
func NewService() *Service {
	return &Service{}
}

// Ping is a simple connectivity test method.
func (s *Service) Ping(ctx context.Context, in *pb.PingRequest) (*pb.PingResponse, error) {
	log.Printf("📥 Received: %s", in.GetMessage())
	return &pb.PingResponse{
		Reply:     "Pong from Go: " + in.GetMessage(),
		Timestamp: time.Now().Unix(),
	}, nil
}

// Compile-time assertion that Service implements the interface.
var _ pb.AgentServiceServer = (*Service)(nil)
