package config

import (
	// 外部依赖
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	openai "github.com/sashabaranov/go-openai"

	// 内部引用
	pb "virganol/server/gen/go/virganol/v1"
)

// Service 实现 ConfigServiceServer 接口
type Service struct {
	pb.UnimplementedConfigServiceServer
	mu      sync.RWMutex
	dataDir string // 存储配置文件的目录
}

const configFileName = "llm_config.json"

// New 创建一个服务实例
// dataDir: 配置文件存储的文件夹路径
func New(dataDir string) *Service {
	// 确保存储目录存在
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		fmt.Printf("⚠️ Warning: Failed to create data dir: %v\n", err)
	}
	return &Service{
		dataDir: dataDir,
	}
}

// getConfigFile 获取配置文件的完整路径
func (s *Service) getConfigFile() string {
	return filepath.Join(s.dataDir, configFileName)
}

// VerifyLLMConfig 实现配置验证：不保存，直接发请求测试
func (s *Service) VerifyLLMConfig(ctx context.Context, req *pb.VerifyLLMConfigRequest) (*pb.VerifyLLMConfigResponse, error) {
	cfg := req.Config
	if cfg == nil {
		return &pb.VerifyLLMConfigResponse{IsValid: false, Message: "Configuration is empty"}, nil
	}

	// 目前先只支持 OpenAI 格式的验证
	// 如果未来支持 Claude/Gemini，可以在这里加 switch case

	// 1. 创建临时的 OpenAI 客户端配置
	clientConfig := openai.DefaultConfig(cfg.ApiKey)

	// 如果用户填了 Base URL (虽然目前 Proto 里还没暴露，但代码先预留好逻辑，或者只用默认)
	// clientConfig.BaseURL = ...

	client := openai.NewClientWithConfig(clientConfig)

	// 2. 发起一个极轻量的请求 (List Models) 来验证 Key 是否有效
	// 这是一个非常快且省钱的验证方式
	_, err := client.ListModels(ctx)
	if err != nil {
		return &pb.VerifyLLMConfigResponse{
			IsValid: false,
			Message: fmt.Sprintf("Verification failed: %v", err),
		}, nil
	}

	return &pb.VerifyLLMConfigResponse{
		IsValid: true,
		Message: "Connection established successfully!",
	}, nil
}

// SetLLMConfig 保存配置到 JSON 文件
func (s *Service) SetLLMConfig(ctx context.Context, req *pb.SetLLMConfigRequest) (*pb.SetLLMConfigResponse, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if req.Config == nil {
		return &pb.SetLLMConfigResponse{Success: false, Message: "Config is empty"}, nil
	}

	// 序列化
	data, err := json.MarshalIndent(req.Config, "", "  ")
	if err != nil {
		return &pb.SetLLMConfigResponse{Success: false, Message: err.Error()}, nil
	}

	// 写入文件
	filePath := s.getConfigFile()
	if err := os.WriteFile(filePath, data, 0644); err != nil {
		return &pb.SetLLMConfigResponse{Success: false, Message: fmt.Sprintf("Failed to write file: %v", err)}, nil
	}

	return &pb.SetLLMConfigResponse{Success: true, Message: "Saved"}, nil
}

// GetLLMConfig 读取配置
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
