// apps/desktop/src-tauri/src/container/logging/color.rs
use nu_ansi_term::Color;
use std::fmt::{Debug, Result};
use tracing::field::{Field, Visit};
use tracing_subscriber::{
    field::RecordFields,
    fmt::format::{FormatFields, Writer},
};

/// Formats event fields with cyan keys and plain values.
///
/// 以青色字段名与默认色字段值格式化事件字段。
pub(super) struct ColoredFields;

impl<'writer> FormatFields<'writer> for ColoredFields {
    /// Drives one visitor pass over all fields and returns its outcome.
    ///
    /// 对全部字段执行一轮访问器遍历并返回其结果。
    fn format_fields<R: RecordFields>(&self, mut writer: Writer<'writer>, fields: R) -> Result {
        let mut visitor = ColoredVisitor {
            writer: writer.by_ref(),
            is_empty: true,
            result: Ok(()),
        };
        fields.record(&mut visitor);
        visitor.result
    }
}

/// Visits fields, painting names cyan while keeping the message bare.
///
/// 逐字段访问：字段名染青色，消息字段保持裸输出。
struct ColoredVisitor<'a> {
    /// Writer borrowed for a single formatting pass.
    ///
    /// 单次格式化过程借用的写出器。
    writer: Writer<'a>,
    /// Whether no field has been written yet.
    ///
    /// 是否尚未写入任何字段。
    is_empty: bool,
    /// First error encountered while writing, if any.
    ///
    /// 写入过程中遇到的首个错误。
    result: Result,
}

impl Visit for ColoredVisitor<'_> {
    /// Renders one field: names are cyan, the message stays bare.
    ///
    /// 渲染单个字段：字段名染青色，消息字段裸输出。
    fn record_debug(&mut self, field: &Field, value: &dyn Debug) {
        if self.result.is_err() {
            return;
        }
        let name = field.name();
        if name != "message" && !self.is_empty {
            self.result = self.writer.write_str(" ");
            if self.result.is_err() {
                return;
            }
        }
        self.result = match name {
            "message" => write!(self.writer, "{value:?}"),
            _ if self.writer.has_ansi_escapes() => {
                write!(
                    self.writer,
                    "{}{name}{}={value:?}",
                    Color::Cyan.prefix(),
                    Color::Cyan.suffix()
                )
            }
            _ => write!(self.writer, "{name}={value:?}"),
        };
        self.is_empty = false;
    }
}
