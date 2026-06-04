// apps/desktop/src-tauri/src/core/bot/constants/keyring.rs

/// Service namespace used for provider secrets in the system keyring.
///
/// 系统密钥库中用于存储 Provider 密钥的 service 命名空间。
pub(in crate::core::bot) const PROVIDER_KEYRING_SERVICE: &str = "com.virganol.app.provider";
