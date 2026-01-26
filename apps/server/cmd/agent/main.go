// apps/server/cmd/agent/main.go
package main

import (
	// 外部依赖
	"log"
	"time"

	// 内部引用
	agent "virganol/server/internal/agent"
	lifecycle "virganol/server/internal/lifecycle"
)

func main() {
	// Root context + signal-based cancellation
	rCtx, rCancel := lifecycle.NewRootContext()
	// 取消根上下文，给其上所有子上下文取消的广播
	defer rCancel()
	sigCtx, sigCancel := lifecycle.WithShutdownSignals(rCtx)
	// 注销信号监听器 & 取消信号监听上下文
	defer sigCancel()

	// Configuration for the agent server
	cfg := agent.Config{
		Addr:            "127.0.0.1:0",
		ShutdownTimeout: 20 * time.Second,
	}

	// Delegate execution to the internal/agent package
	if err := agent.Run(sigCtx, cfg); err != nil {
		log.Fatalf("agent run error: %v", err)
	}
}
