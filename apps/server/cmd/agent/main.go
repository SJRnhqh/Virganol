package main

import (
	"log"
	"time"

	"virganol/server/internal/agent"
	"virganol/server/internal/lifecycle"
)

func main() {
	// Root context + signal-based cancellation
	rctx, rcancel := lifecycle.NewRootContext()
	defer rcancel()
	ctx, stop := lifecycle.WithShutdownSignals(rctx)
	defer stop()

	// Configuration for the agent server
	cfg := agent.Config{
		Addr:            "127.0.0.1:0",
		ShutdownTimeout: 20 * time.Second,
	}

	// Delegate execution to the internal/agent package
	if err := agent.Run(ctx, cfg); err != nil {
		log.Fatalf("agent run error: %v", err)
	}
}
