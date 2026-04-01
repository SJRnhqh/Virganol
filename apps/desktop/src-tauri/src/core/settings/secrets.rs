// apps/desktop/src-tauri/src/core/settings/secrets.rs
// 外部依赖
use keyring::{Entry, Error as KeyringError};
use zeroize::Zeroize;

// 内部引用
use crate::core::bot::models::provider::ProviderId;
use crate::core::security::provider::ProviderKey;

/// 应用在系统密钥库中的 service 名称（命名空间）
const KEYRING_SERVICE: &str = "com.virganol.app.providers";

/// 从系统密钥库读取 provider 的 API Key。
///
/// 读取策略（宽容模式）：
/// - `provider_id` 使用 ProviderId 枚举，避免无效字符串传入
/// - 密钥不存在（`NoEntry`）：返回 `None`
/// - 读取过程异常：记录 warn 日志并返回 `None`
///
/// 说明：这里返回 `Option` 是为了让启动检查链路尽量不中断；
/// 若后续用于”强校验场景”（如 connect 保存事务），可升级为 `Result<Option<String>, _>`。
pub(crate) fn load_provider_key(provider_id: ProviderId) -> Option<ProviderKey> {
    // keyring 的 Entry 由 (service, user/account) 唯一定位。
    // 这里将 provider_id 作为第二个索引键（account）使用。
    let account = provider_id.as_str();

    let entry = match Entry::new(KEYRING_SERVICE, account) {
        Ok(entry) => entry,
        Err(error) => {
            // keyring 初始化失败：记录警告并降级为“无可用密钥”。
            log::warn!("[Tauri] ⚠️ init keyring entry failed: {}", error);
            return None;
        }
    };

    match entry.get_password() {
        Ok(mut value) => {
            let normalized = value.trim();
            if normalized.is_empty() {
                value.zeroize();
                return None;
            }

            let requires_trim_copy = normalized.len() != value.len();
            if requires_trim_copy {
                let normalized_owned = normalized.to_string();
                value.zeroize();
                Some(ProviderKey::new(normalized_owned))
            } else {
                Some(ProviderKey::new(value))
            }
        }
        Err(KeyringError::NoEntry) => None,
        Err(error) => {
            // keyring 读取失败：记录警告并降级为“无可用密钥”。
            log::warn!("[Tauri] ⚠️ load key failed for {}: {}", account, error);
            None
        }
    }
}

/// 从环境变量读取 provider 的 API Key（开发/CI 兜底）。
pub(crate) fn load_provider_key_from_env(provider_id: ProviderId) -> Option<ProviderKey> {
    for env_name in provider_id.env_key_names() {
        if let Ok(mut value) = std::env::var(env_name) {
            let normalized = value.trim();
            if normalized.is_empty() {
                value.zeroize();
                continue;
            }

            log::info!("[Tauri] 🔐 load key from env: {}", env_name);
            let requires_trim_copy = normalized.len() != value.len();
            if requires_trim_copy {
                let normalized_owned = normalized.to_string();
                value.zeroize();
                return Some(ProviderKey::new(normalized_owned));
            }
            return Some(ProviderKey::new(value));
        }
    }

    None
}

/// 将 provider 的 API Key 写入系统密钥库。
///
/// - `provider_id` 使用 ProviderId 枚举，避免无效字符串传入
/// - `key` 允许空字符串：空时等价于删除条目
pub(crate) fn save_provider_key(provider_id: ProviderId, key: &str) -> Result<(), String> {
    let normalized_key = key.trim();
    let account = provider_id.as_str();

    if normalized_key.is_empty() {
        return remove_provider_key(provider_id);
    }

    let entry = Entry::new(KEYRING_SERVICE, account)
        .map_err(|error| format!("init keyring entry failed: {}", error))?;
    entry
        .set_password(normalized_key)
        .map_err(|error| format!("save key failed for {}: {}", account, error))
}

/// 从系统密钥库删除 provider 的 API Key。
///
/// - `provider_id` 使用 ProviderId 枚举，避免无效字符串传入
/// - 条目不存在（`NoEntry`）视为成功（幂等）
pub(crate) fn remove_provider_key(provider_id: ProviderId) -> Result<(), String> {
    let account = provider_id.as_str();

    let entry = Entry::new(KEYRING_SERVICE, account)
        .map_err(|error| format!("init keyring entry failed: {}", error))?;

    match entry.delete_credential() {
        Ok(()) | Err(KeyringError::NoEntry) => Ok(()),
        Err(error) => Err(format!("remove key failed for {}: {}", account, error)),
    }
}
