// apps/desktop/src-tauri/src/core/bot/models/provider/key.rs
// 外部依赖
use zeroize::Zeroize;

pub struct ProviderKey(String);

impl ProviderKey {
    pub fn new(value: String) -> Self {
        Self(value)
    }

    pub fn as_str(&self) -> &str {
        self.0.as_str()
    }
}

impl Drop for ProviderKey {
    fn drop(&mut self) {
        self.0.zeroize();
    }
}
