// apps/desktop/src-tauri/src/core/bot/models/provider/secret/key.rs
use zeroize::Zeroize;

/// Provider API key value object that zeroizes its inner buffer on drop.
///
/// Provider API key 值对象，在释放时清零内部缓冲区。
pub(in crate::core::bot) struct ProviderKey(
    /// Secret key string buffer owned by the value object.
    ///
    /// 值对象持有的密钥字符串缓冲区。
    String,
);

impl ProviderKey {
    /// Creates a provider key from an owned string.
    ///
    /// 使用已取得所有权的字符串创建 Provider key。
    pub(in crate::core::bot) fn new(value: String) -> Self {
        Self(value)
    }

    /// Returns the key as a string slice for read-only use.
    ///
    /// 以只读字符串切片形式返回 key。
    pub(in crate::core::bot) fn as_str(&self) -> &str {
        self.0.as_str()
    }
}

impl Drop for ProviderKey {
    /// Zeroizes the inner key buffer before the value is released.
    ///
    /// 在值释放前清零内部 key 缓冲区。
    fn drop(&mut self) {
        self.0.zeroize();
    }
}
