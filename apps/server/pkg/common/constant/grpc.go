// apps/server/pkg/common/constant/grpc.go
package constant

import (
	// 外部依赖
	"time"
)

const (
	GRPC_ADDR             = "127.0.0.1:0"
	GRPC_SHUTDOWN_TIMEOUT = 20 * time.Second
)
