package lifecycle

import (
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
	return signal.NotifyContext(parent, sigs...)
}

// WithShutdownTimeout returns a deadline-bound context derived from parent,
// typically used to limit the duration of graceful shutdown operations.
// When the timeout expires, the returned context is cancelled automatically.
func WithShutdownTimeout(parent context.Context, d time.Duration) (context.Context, context.CancelFunc) {
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
		defer close(done)
		fn()
	}()

	select {
	case <-done:
		return false
	case <-ctx.Done():
		return true
	}
}
