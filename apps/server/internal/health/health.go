// apps/server/internal/health/health.go
// 保留健康检查的代码但后续需要重构和重新兼容到现有架构设计中
package health

import (
	// 外部依赖
	"log"

	grpc "google.golang.org/grpc"
	health "google.golang.org/grpc/health"
	healthpb "google.golang.org/grpc/health/grpc_health_v1"
)

// HealthManager wraps gRPC health server and provides
// small helpers to manage liveness/readiness states.
type HealthManager struct {
	hs *health.Server
}

// Full service names for health checks.
const (
	// ServiceAll represents the overall server (liveness).
	ServiceAll = ""

	// ServiceAgent is the fully qualified name of the Agent gRPC service.
	// It must match "package.Service" from the proto definition.
	// proto: package = virganol.v1, service = AgentService
	ServiceAgent = "virganol.v1.AgentService"
)

// NewHealthManager creates a new health manager with default NOT_SERVING
// state for known services. Caller should set desired states explicitly
// (e.g., SetOverallServing()) after registration.
func NewHealthManager() *HealthManager {
	h := &HealthManager{hs: health.NewServer()}

	// Initialize known services to NOT_SERVING; avoid SERVICE_UNKNOWN.
	h.hs.SetServingStatus(ServiceAll, healthpb.HealthCheckResponse_NOT_SERVING)
	h.hs.SetServingStatus(ServiceAgent, healthpb.HealthCheckResponse_NOT_SERVING)

	return h
}

// Register registers the underlying health server to the given gRPC server.
// Call this during server bootstrap after creating the gRPC server.
func (h *HealthManager) Register(s *grpc.Server) {
	healthpb.RegisterHealthServer(s, h.hs)
}

func (h *HealthManager) SetServing(service string, serving bool) {

	if serving {

		h.hs.SetServingStatus(service, healthpb.HealthCheckResponse_SERVING)

		log.Printf("health: set %q to SERVING", service)
	} else {

		h.hs.SetServingStatus(service, healthpb.HealthCheckResponse_NOT_SERVING)

		log.Printf("health: set %q to NOT_SERVING", service)
	}

}

// Convenience helpers

// SetOverallServing marks overall liveness (service="") as SERVING.
func (h *HealthManager) SetOverallServing() { h.SetServing(ServiceAll, true) }

// SetOverallNotServing marks overall liveness (service="") as NOT_SERVING.
func (h *HealthManager) SetOverallNotServing() { h.SetServing(ServiceAll, false) }

// SetAgentServing marks the Agent service as SERVING.
func (h *HealthManager) SetAgentServing() { h.SetServing(ServiceAgent, true) }

// SetAgentNotServing marks the Agent service as NOT_SERVING.
func (h *HealthManager) SetAgentNotServing() { h.SetServing(ServiceAgent, false) }

// Shutdown flips all known services to NOT_SERVING.
// Typically called right before graceful stop begins.
func (h *HealthManager) Shutdown() {
	h.SetOverallNotServing()
	h.SetAgentNotServing()
}
