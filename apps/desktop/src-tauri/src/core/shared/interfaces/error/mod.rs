// apps/desktop/src-tauri/src/core/shared/interfaces/error/mod.rs
mod downgrade;

pub(in crate::core) use downgrade::{impl_downgrade, Downgrade};
