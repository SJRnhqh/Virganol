// apps/desktop/src-tauri/src/core/shared/models/context/attribution.rs

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
