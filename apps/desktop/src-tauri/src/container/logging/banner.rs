// apps/desktop/src-tauri/src/container/logging/banner.rs
use nu_ansi_term::Color;
use std::path::Path;

use super::BANNER_ART;

/// Emits the console-only startup banner with branding and resolved logging facts.
///
/// 输出仅控制台可见的启动横幅，携带品牌信息与已解析日志事实。
pub(super) fn emit_startup_banner(log_dir: &Path, log_level: &str) {
    let version = env!("CARGO_PKG_VERSION");

    let primary = [format!("❯ version {version}"), "❯ logs".to_string()];
    let secondary = [
        format!("    · dir    {}", log_dir.display()),
        format!("    · level  {log_level}"),
    ];

    let art_width = BANNER_ART
        .iter()
        .map(|row| row.chars().count())
        .max()
        .unwrap_or(0);
    let content_width = art_width.max(
        primary
            .iter()
            .chain(secondary.iter())
            .map(|fact| fact.chars().count())
            .max()
            .unwrap_or(0),
    );
    let inner_width = content_width + 4;
    let outer_width = inner_width + 4;

    eprintln!();
    eprintln!("▛{}▜", "▀".repeat(outer_width));
    eprintln!("▌ ┌{}┐ ▐", "─".repeat(inner_width));
    eprintln!("▌ │{}│ ▐", " ".repeat(inner_width));
    let art_pad = " ".repeat((content_width - art_width) / 2);
    for row in BANNER_ART {
        let line = format!("{art_pad}{row}");
        eprintln!(
            "▌ │  {}  │ ▐",
            Color::Green.bold().paint(format!("{line:<content_width$}"))
        );
    }
    eprintln!("▌ │{}│ ▐", " ".repeat(inner_width));
    let marker = Color::Green.dimmed();
    for line in &primary {
        let padded = format!("{line:<content_width$}");
        eprintln!(
            "▌ │  {}  │ ▐",
            padded.replacen("❯", &marker.paint("❯").to_string(), 1)
        );
    }
    for line in &secondary {
        let padded = format!("{line:<content_width$}");
        eprintln!(
            "▌ │  {}  │ ▐",
            padded.replacen("·", &marker.paint("·").to_string(), 1)
        );
    }
    eprintln!("▌ │{}│ ▐", " ".repeat(inner_width));
    eprintln!("▌ └{}┘ ▐", "─".repeat(inner_width));
    eprintln!("▙{}▟", "▄".repeat(outer_width));
}
