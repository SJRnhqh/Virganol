// dev/scripts/rust/comments/crates/core/src/models/attrs.rs
use syn::{
    AttrStyle::{Inner, Outer},
    Attribute,
};

/// Represents documentation attributes owned by a target.
///
/// 描述目标自身拥有的文档属性。
pub(crate) enum DocAttrs {
    /// Has no documentation attributes.
    ///
    /// 不存在文档属性。
    Absent,
    /// Has outer documentation attributes only.
    ///
    /// 仅存在外部文档属性。
    OuterOnly,
    /// Has inner documentation attributes only.
    ///
    /// 仅存在内部文档属性。
    InnerOnly,
    /// Has both outer and inner documentation attributes.
    ///
    /// 同时存在外部与内部文档属性。
    Mixed,
}

impl DocAttrs {
    /// Classifies documentation attributes owned by a target.
    ///
    /// 对目标自身拥有的文档属性进行分类。
    pub(crate) fn from_attributes(attrs: &[Attribute]) -> Self {
        attrs
            .iter()
            .filter(|attribute| attribute.path().is_ident("doc"))
            .fold(Self::Absent, |doc_attrs, attribute| {
                match (doc_attrs, &attribute.style) {
                    (Self::Absent | Self::OuterOnly, Outer) => Self::OuterOnly,
                    (Self::Absent | Self::InnerOnly, Inner(_)) => Self::InnerOnly,
                    (Self::OuterOnly, Inner(_)) | (Self::InnerOnly, Outer) | (Self::Mixed, _) => {
                        Self::Mixed
                    }
                }
            })
    }
}
