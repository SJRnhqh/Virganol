// apps/server/cmd/agent/main.go
package main

import (
	// 外部依赖
	"context"
	"flag"
	"log"

	// 内部引用
	grpcserver "virganol/server/internal/grpcserver"
	lifecycle "virganol/server/internal/lifecycle"
)

func main() {
	// Test
	dataDir := flag.String("app-data-dir", ".", "Directory to store application data (config, db, etc)")
	flag.Parse()
	log.Printf("🚀 Virganol Agent Starting...")
	log.Printf("📂 Data Directory: %s", *dataDir)
	
	// Create root context and listen for OS signals (SIGINT, SIGTERM)	
	rCtx, rCancel := context.WithCancel(context.Background())
	defer rCancel()

	appCtx, stopSignals := lifecycle.WithShutdownSignals(rCtx)
	defer stopSignals()

	// Delegate execution to the gRPC server
	if err := grpcserver.Run(appCtx, *dataDir); err != nil {
		log.Fatalf("❌ gRPC server run error: %v", err)
	}
}
