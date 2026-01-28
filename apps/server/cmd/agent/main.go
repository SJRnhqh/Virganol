// apps/server/cmd/agent/main.go
package main

import (
	// 外部依赖
	"context"
	"log"

	// 内部引用
	grpcserver "virganol/server/internal/grpcserver"
	lifecycle "virganol/server/internal/lifecycle"
)

func main() {
	// Create root context and listen for OS signals (SIGINT, SIGTERM)
	rCtx, rCancel := context.WithCancel(context.Background())
	defer rCancel()

	appCtx, stopSignals := lifecycle.WithShutdownSignals(rCtx)
	defer stopSignals()

	// Delegate execution to the gRPC server
	if err := grpcserver.Run(appCtx); err != nil {
		log.Fatalf("gRPC server run error: %v", err)
	}
}
