// apps/server/internal/grpcserver/registration.go
package grpcserver

import (
	// 外部依赖
	grpc "google.golang.org/grpc"

	// 内部引用
	pb "virganol/server/gen/go/virganol/v1"
	base "virganol/server/pkg/service/base"
	config "virganol/server/pkg/service/config"
)

type ServiceHandles struct {
	ShutdownCh <-chan struct{}
}

func RegisterServices(s *grpc.Server, dataDir string) ServiceHandles {
	// 1. Base Service (基础服务)
	baseService := base.NewBaseService()
	pb.RegisterBaseServiceServer(s, baseService)

	// 2. Config Service（配置服务）
	configService := config.New(dataDir)
	pb.RegisterConfigServiceServer(s, configService)

	return ServiceHandles{
		ShutdownCh: baseService.ShutdownChan(),
	}
}
