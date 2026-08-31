// apps/desktop/src-tauri/src/core/shared/models/context/attribution.rs
use std::fmt::{Display, Formatter, Result};

/// Application attribution projected from runtime context.
///
/// 从运行时上下文投影出的应用归因。
pub(in crate::core) struct AppAttribution<Stage, Subject, Operation> {
    /// Runtime stage.
    ///
    /// 运行时阶段。
    stage: Stage,
    /// Attributed subject.
    ///
    /// 归因主体。
    subject: Subject,
    /// Performed operation.
    ///
    /// 执行的操作。
    operation: Operation,
}

impl<Stage, Subject, Operation> AppAttribution<Stage, Subject, Operation> {
    /// Consumes this attribution into its structured logging fields.
    ///
    /// 消费当前归因并返回其结构化日志字段。
    pub(in crate::core) fn into_parts(self) -> (Stage, Subject, Operation) {
        (self.stage, self.subject, self.operation)
    }

    /// Creates application attribution from its constituent parts.
    ///
    /// 基于组成部分创建应用归因。
    pub(in crate::core) fn from_parts(
        stage: Stage,
        subject: Subject,
        operation: Operation,
    ) -> Self {
        Self {
            stage,
            subject,
            operation,
        }
    }
}

impl<Stage, Subject, Operation> Display for AppAttribution<Stage, Subject, Operation>
where
    Stage: Display,
    Subject: Display,
    Operation: Display,
{
    /// Formats this application attribution for text output.
    ///
    /// 格式化当前应用归因以用于文本输出。
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        write!(
            f,
            "subject={}; operation={}; stage={}",
            self.subject, self.operation, self.stage
        )
    }
}
