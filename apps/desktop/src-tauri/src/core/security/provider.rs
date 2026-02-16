// apps/desktop/src-tauri/src/core/security/provider.rs
// 外部依赖
use zeroize::Zeroize;

pub(crate) struct ProviderKey(String);

impl ProviderKey {
    pub(crate) fn new(value: String) -> Self {
        Self(value)
    }

    pub(crate) fn as_str(&self) -> &str {
        self.0.as_str()
    }
}

impl Drop for ProviderKey {
    fn drop(&mut self) {
        self.0.zeroize();
    }
}
