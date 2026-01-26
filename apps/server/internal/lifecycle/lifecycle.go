// apps/server/internal/lifecycle/lifecycle.go
package lifecycle

import (
	// 外部依赖
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// NewRootContext creates a cancellable root context that represents the
// lifetime of the current process. Call the returned cancel function to
// proactively begin shutdown.
func NewRootContext() (context.Context, context.CancelFunc) {
	// 返回一个可以被取消的根上下文
	return context.WithCancel(context.Background())
}

// WithShutdownSignals returns a context that is cancelled when any of the
// provided OS signals are received. If no signals are provided, it defaults
// to os.Interrupt and syscall.SIGTERM.
//
// The returned stop function must be called to release underlying signal
// resources (typically via defer).
func WithShutdownSignals(parent context.Context, sigs ...os.Signal) (context.Context, func()) {
	if len(sigs) == 0 {
		sigs = []os.Signal{os.Interrupt, syscall.SIGTERM}
	}
	// 默认返回监听信号的子上下文
	return signal.NotifyContext(parent, sigs...)
}

// WithShutdownTimeout returns a deadline-bound context derived from parent,
// typically used to limit the duration of graceful shutdown operations.
// When the timeout expires, the returned context is cancelled automatically.
func WithShutdownTimeout(parent context.Context, d time.Duration) (context.Context, context.CancelFunc) {
	// 返回超时自动取消的子上下文
	return context.WithTimeout(parent, d)
}

// RunWithTimeout executes a blocking function fn in a separate goroutine and
// waits until either fn completes or the provided context is cancelled.
// It returns true if the context timed out or was cancelled before fn completed.
//
// This is useful for graceful operations that do not accept a context (e.g.,
// grpc.Server.GracefulStop), allowing you to enforce an upper bound on their
// duration and apply a fallback action on timeout.
func RunWithTimeout(ctx context.Context, fn func()) (timedOut bool) {
	done := make(chan struct{})
	go func() {
		// done 仅用于“完成通知”：不发送任何值，靠关闭 channel 表示 fn 已结束。
		// 无论 fn 正常返回还是发生 panic 导致 goroutine 退出，defer 都会执行，确保关闭 done。
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
