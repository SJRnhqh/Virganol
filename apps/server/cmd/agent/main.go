// apps/server/cmd/agent/main.go
package main

import (
	// 外部依赖
	"log"

	// 内部引用
	grpcserver "virganol/server/internal/grpcserver"
	lifecycle "virganol/server/internal/lifecycle"
)

func main() {
	// Root context + signal-based cancellation
	rCtx, rCancel := lifecycle.NewRootContext()
	// 取消根上下文，给其上所有子上下文取消的广播
	defer rCancel()
	appCtx, appCancel := lifecycle.WithShutdownSignals(rCtx)
	// 注销信号监听器 & 取消监听信号的应用上下文
	defer appCancel()

	// Delegate execution to the internal/agent package
	if err := grpcserver.Run(appCtx); err != nil {
		log.Fatalf("gRPC server run error: %v", err)
	}
}
