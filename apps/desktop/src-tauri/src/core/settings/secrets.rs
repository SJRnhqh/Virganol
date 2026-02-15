// apps/desktop/src-tauri/src/core/settings/secrets.rs
// 外部引用
use keyring::{Entry, Error as KeyringError};
use zeroize::Zeroize;

use crate::core::security::provider::ProviderKey;

/// 应用在系统密钥库中的 service 名称（命名空间）
const KEYRING_SERVICE: &str = "com.virganol.app.providers";

/// 从系统密钥库读取 provider 的 API Key。
///
/// 读取策略（宽容模式）：
/// - `provider_id` 为空：返回 `None`
/// - 密钥不存在（`NoEntry`）：返回 `None`
/// - 读取过程异常：记录 warn 日志并返回 `None`
///
/// 说明：这里返回 `Option` 是为了让启动检查链路尽量不中断；
/// 若后续用于“强校验场景”（如 connect 保存事务），可升级为 `Result<Option<String>, _>`。
pub fn load_provider_key(provider_id: &str) -> Option<ProviderKey> {
    // keyring 的 Entry 由 (service, user/account) 唯一定位。
    // 这里将 provider_id 作为第二个索引键（account）使用。
    let account = provider_id.trim();
    if account.is_empty() {
        log::warn!("[Tauri] load key skipped: provider_id is empty");
        return None;
    }

    let entry = match Entry::new(KEYRING_SERVICE, account) {
        Ok(entry) => entry,
        Err(error) => {
            log::warn!("[Tauri] init keyring entry failed: {}", error);
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
            log::warn!("[Tauri] load key failed for {}: {}", account, error);
            None
        }
    }
}
