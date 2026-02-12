// apps/server/pkg/service/config/config.go
// Go sidecar 在 dataDir（由 Rust 指定）范围内的 scoped 文件读写能力
package config

import (
	// 外部依赖
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	// 内部引用
	pb "virganol/server/gen/go/virganol/v1"
)

// Service 实现 ConfigServiceServer 接口
type Service struct {
	pb.UnimplementedConfigServiceServer
	mu      sync.RWMutex
	dataDir string // Rust（房东）指定的 scoped 目录
}

const configFileName = "llm_config.json"

// New 创建一个服务实例
// dataDir: 由 Rust 启动时通过 --app-data-dir 传入的 scoped 目录
func New(dataDir string) *Service {
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		fmt.Printf("⚠️ Warning: Failed to create data dir: %v\n", err)
	}
	return &Service{dataDir: dataDir}
}

// getConfigFile 获取配置文件的完整路径
func (s *Service) getConfigFile() string {
	return filepath.Join(s.dataDir, configFileName)
}

// SetLLMConfig 保存配置到 JSON 文件（scoped write）
func (s *Service) SetLLMConfig(ctx context.Context, req *pb.SetLLMConfigRequest) (*pb.SetLLMConfigResponse, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if req.Config == nil {
		return &pb.SetLLMConfigResponse{Success: false, Message: "Config is empty"}, nil
	}

	data, err := json.MarshalIndent(req.Config, "", "  ")
	if err != nil {
		return &pb.SetLLMConfigResponse{Success: false, Message: err.Error()}, nil
	}

	filePath := s.getConfigFile()
	if err := os.WriteFile(filePath, data, 0644); err != nil {
		return &pb.SetLLMConfigResponse{Success: false, Message: fmt.Sprintf("Failed to write file: %v", err)}, nil
	}

	return &pb.SetLLMConfigResponse{Success: true, Message: "Saved"}, nil
}

// GetLLMConfig 读取配置（scoped read）
func (s *Service) GetLLMConfig(ctx context.Context, req *pb.GetLLMConfigRequest) (*pb.GetLLMConfigResponse, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	filePath := s.getConfigFile()
	data, err := os.ReadFile(filePath)
	if os.IsNotExist(err) {
		return &pb.GetLLMConfigResponse{Exists: false}, nil
	}
	if err != nil {
		return nil, err
	}

	var config pb.LLMConfig
	if err := json.Unmarshal(data, &config); err != nil {
		return nil, err
	}

	return &pb.GetLLMConfigResponse{Config: &config, Exists: true}, nil
}
