use tauri::State;
use super::manager::SidecarState;
// 引入 rpc.rs 中生成的 gRPC 客户端和请求结构体
use super::rpc::config_service_client::ConfigServiceClient;
use super::rpc::{LlmConfig, SetLlmConfigRequest, VerifyLlmConfigRequest, GetLlmConfigRequest};

// 定义一个前端可用的 Config 结构体 
// (原因：Prost 生成的 LlmConfig 默认不支持 JSON 序列化，我们这里手动定义一个镜像结构体方便前端交互)
#[derive(serde::Serialize, serde::Deserialize)]
pub struct AppLLMConfig {
    pub provider: String,
    pub api_key: String,
    pub model: String,
}

// 1. 验证配置命令
#[tauri::command]
pub async fn verify_llm_config(
    state: State<'_, SidecarState>,
    config: AppLLMConfig,
) -> Result<String, String> {
    // 获取地址
    let addr = state.get_grpc_addr().await.ok_or("Sidecar not connected yet")?;
    
    // 连接 gRPC
    let mut client = ConfigServiceClient::connect(addr)
        .await
        .map_err(|e| format!("Failed to connect: {}", e))?;

    // 构造请求
    let req = VerifyLlmConfigRequest {
        config: Some(LlmConfig {
            provider: config.provider,
            api_key: config.api_key,
            model: config.model,
        }),
    };

    // 调用接口
    let res = client.verify_llm_config(req)
        .await
        .map_err(|e| format!("RPC call failed: {}", e))?
        .into_inner();

    // 返回结果
    if res.is_valid {
        Ok(res.message)
    } else {
        Err(res.message) // 验证失败也当做错误抛给前端捕获
    }
}

// 2. 保存配置命令
#[tauri::command]
pub async fn set_llm_config(
    state: State<'_, SidecarState>,
    config: AppLLMConfig,
) -> Result<String, String> {
    let addr = state.get_grpc_addr().await.ok_or("Sidecar not connected yet")?;
    let mut client = ConfigServiceClient::connect(addr)
        .await
        .map_err(|e| e.to_string())?;

    let req = SetLlmConfigRequest {
        config: Some(LlmConfig {
            provider: config.provider,
            api_key: config.api_key,
            model: config.model,
        }),
    };

    let res = client.set_llm_config(req)
        .await
        .map_err(|e| e.to_string())?
        .into_inner();

    if res.success {
        Ok(res.message)
    } else {
        Err(res.message)
    }
}

// 3. 获取配置命令
#[tauri::command]
pub async fn get_llm_config(
    state: State<'_, SidecarState>,
) -> Result<Option<AppLLMConfig>, String> {
    let addr = state.get_grpc_addr().await.ok_or("Sidecar not connected yet")?;
    let mut client = ConfigServiceClient::connect(addr)
        .await
        .map_err(|e| e.to_string())?;

    let res = client.get_llm_config(GetLlmConfigRequest {})
        .await
        .map_err(|e| e.to_string())?
        .into_inner();

    if res.exists {
        if let Some(cfg) = res.config {
            Ok(Some(AppLLMConfig {
                provider: cfg.provider,
                api_key: cfg.api_key,
                model: cfg.model,
            }))
        } else {
            Ok(None)
        }
    } else {
        Ok(None)
    }
}