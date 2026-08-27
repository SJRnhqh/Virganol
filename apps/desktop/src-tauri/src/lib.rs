// apps/desktop/src-tauri/src/lib.rs
mod commands;
mod container;
mod core;
mod tmp;

pub use container::run;

// Expands the command handler in the root scope.
//
// 在根作用域展开命令处理器。
include!("invoke.rs");
