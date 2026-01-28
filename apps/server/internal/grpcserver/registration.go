// apps/server/internal/grpcserver/registration.go
package grpcserver

import (
	// 外部依赖
	grpc "google.golang.org/grpc"

	// 内部引用
	base "virganol/server/pkg/service/base"
	pb "virganol/server/gen/go/virganol/v1"
)

type ServiceHandles struct {
	ShutdownCh <-chan struct{}
}

func RegisterServices(s *grpc.Server) ServiceHandles {
	baseService := base.NewBaseService()
	pb.RegisterBaseServiceServer(s, baseService)
	return ServiceHandles{
		ShutdownCh: baseService.ShutdownChan(),
	}
}
