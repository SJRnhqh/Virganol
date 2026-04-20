// apps/desktop/src-tauri/src/core/bot/services/settings/provider/key/load.rs
// 外部依赖
use keyring::{Entry, Error as KeyringError};
use zeroize::Zeroize;

// 内部引用
use super::super::super::super::super::{ProviderId, ProviderKey, PROVIDER_KEYRING_SERVICE};

/// 从系统密钥库读取 provider 的 API Key。
///
/// 读取策略（宽容模式）：
/// - `provider_id` 使用 ProviderId 枚举，避免无效字符串传入
/// - 密钥不存在（`NoEntry`）：返回 `None`
/// - 读取过程异常：记录 warn 日志并返回 `None`
///
/// 说明：这里返回 `Option` 是为了让启动检查链路尽量不中断；
/// 若后续用于"强校验场景"（如 connect 保存事务），可升级为 `Result<Option<String>, _>`。
pub(crate) fn load_provider_key(provider_id: ProviderId) -> Option<ProviderKey> {
    let entry = Entry::new(PROVIDER_KEYRING_SERVICE, provider_id.as_str())
        .inspect_err(|e| log::warn!("[Tauri] ⚠️ init keyring entry failed: {}", e))
        .ok()?;

    let value = match entry.get_password() {
        Ok(value) => value,
        Err(KeyringError::NoEntry) => return None,
        Err(e) => {
            log::warn!(
                "[Tauri] ⚠️ load key failed for {}: {}",
                provider_id.as_str(),
                e
            );
            return None;
        }
    };

    normalize_and_wrap_key(value)
}

/// 从环境变量读取 provider 的 API Key（开发/CI 兜底）。
pub(crate) fn load_provider_env(provider_id: ProviderId) -> Option<ProviderKey> {
    provider_id.env_key_names().iter().find_map(|env_name| {
        let value = std::env::var(env_name).ok()?;
        let result = normalize_and_wrap_key(value);
        if result.is_some() {
            log::info!("[Tauri] 🔐 load key from env: {}", env_name);
        }
        result
    })
}

/// 规范化密钥：trim 空白 + 安全清零 + 零拷贝优化
///
/// 处理逻辑：
/// 1. trim 首尾空白
/// 2. 空字符串返回 None（安全清零原始值）
/// 3. 有空白：复制 trim 后的结果，清零原始值
/// 4. 无空白：直接使用原始值（零拷贝）
fn normalize_and_wrap_key(mut value: String) -> Option<ProviderKey> {
    let normalized = value.trim();

    if normalized.is_empty() {
        value.zeroize();
        return None;
    }

    let key = if normalized.len() != value.len() {
        let normalized_owned = normalized.to_string();
        value.zeroize();
        normalized_owned
    } else {
        value
    };

    Some(ProviderKey::new(key))
}
