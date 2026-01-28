// apps/server/internal/lifecycle/lifecycle.go
package lifecycle

import (
	// 外部依赖
	"context"
	"os"
	"os/signal"
	"syscall"
)

// WithShutdownSignals 监听OS信号（SIGINT/SIGTERM），当收到信号时取消context。
// 若未指定信号，默认监听 os.Interrupt 和 syscall.SIGTERM。
// 返回的stop函数必须调用以释放信号监听资源。
func WithShutdownSignals(parent context.Context, sigs ...os.Signal) (context.Context, func()) {
	if len(sigs) == 0 {
		sigs = []os.Signal{os.Interrupt, syscall.SIGTERM}
	}
	return signal.NotifyContext(parent, sigs...)
}

// RunWithTimeout 在独立goroutine中执行fn，并等待其完成或context超时。
// 用于为不支持context的阻塞操作（如grpc.Server.GracefulStop）添加超时机制。
func RunWithTimeout(ctx context.Context, fn func()) (timedOut bool) {
	done := make(chan struct{})
	go func() {
		defer close(done)
		fn()
	}()

	select {
	case <-done:
		// fn 在关闭窗口内完成（无超时）
		return false
	case <-ctx.Done():
		// 关闭窗口到期或被取消（超时/提前取消）
		return true
	}
}
