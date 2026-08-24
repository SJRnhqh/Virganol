// dev/scripts/rust/comments/crates/core/src/checker.rs
use syn::{
    parse_file, Fields,
    ForeignItem::{self, Fn as ForeignFn, Static as ForeignStatic},
    ImplItem::{self, Const as ImplConst, Fn as ImplFn, Type as ImplType},
    Item::{
        self, Const, Enum, Fn, ForeignMod, Impl, Macro, Mod, Static, Struct, Trait, Type, Union,
    },
    TraitItem::{self, Const as TraitConst, Fn as TraitFn, Type as TraitType},
};

use super::{check_target_outer_line_doc, CommentCheckConfig, CommentCheckError};

/// Checks required Rust declarations for outer line documentation.
///
/// 检查必需的声明是否具有外部行文档注释。
pub fn check_source(source: &str, config: &CommentCheckConfig) -> Result<(), CommentCheckError> {
    let file = parse_file(source).map_err(|_| CommentCheckError::parse())?;

    check_items(source, config, &file.items)
}

/// Checks required item declarations and their nested targets.
///
/// 检查必需的项目声明及其嵌套目标。
fn check_items(
    source: &str,
    config: &CommentCheckConfig,
    items: &[Item],
) -> Result<(), CommentCheckError> {
    for item in items {
        match item {
            Const(item) => check_target_outer_line_doc(source, config, item, &item.attrs)?,
            Enum(item) => {
                check_target_outer_line_doc(source, config, item, &item.attrs)?;

                for variant in &item.variants {
                    check_target_outer_line_doc(source, config, variant, &variant.attrs)?;
                    check_fields(source, config, &variant.fields)?;
                }
            }
            Fn(item) => check_target_outer_line_doc(source, config, item, &item.attrs)?,
            ForeignMod(item) => check_foreign_items(source, config, &item.items)?,
            Impl(item) => check_impl_items(source, config, &item.items)?,
            Macro(item) if item.ident.is_some() => {
                check_target_outer_line_doc(source, config, item, &item.attrs)?;
            }
            Mod(item) => {
                if let Some((_, items)) = &item.content {
                    check_items(source, config, items)?;
                }
            }
            Static(item) => check_target_outer_line_doc(source, config, item, &item.attrs)?,
            Struct(item) => {
                check_target_outer_line_doc(source, config, item, &item.attrs)?;
                check_fields(source, config, &item.fields)?;
            }
            Trait(item) => {
                check_target_outer_line_doc(source, config, item, &item.attrs)?;
                check_trait_items(source, config, &item.items)?;
            }
            Type(item) => check_target_outer_line_doc(source, config, item, &item.attrs)?,
            Union(item) => {
                check_target_outer_line_doc(source, config, item, &item.attrs)?;

                for field in &item.fields.named {
                    check_target_outer_line_doc(source, config, field, &field.attrs)?;
                }
            }
            _ => {}
        }
    }

    Ok(())
}

/// Checks required struct or enum fields.
///
/// 检查必需的结构体或枚举字段。
fn check_fields(
    source: &str,
    config: &CommentCheckConfig,
    fields: &Fields,
) -> Result<(), CommentCheckError> {
    for field in fields {
        check_target_outer_line_doc(source, config, field, &field.attrs)?;
    }

    Ok(())
}

/// Checks required trait associated items.
///
/// 检查必需的特征关联项目。
fn check_trait_items(
    source: &str,
    config: &CommentCheckConfig,
    items: &[TraitItem],
) -> Result<(), CommentCheckError> {
    for item in items {
        match item {
            TraitConst(item) => check_target_outer_line_doc(source, config, item, &item.attrs)?,
            TraitFn(item) => check_target_outer_line_doc(source, config, item, &item.attrs)?,
            TraitType(item) => check_target_outer_line_doc(source, config, item, &item.attrs)?,
            _ => {}
        }
    }

    Ok(())
}

/// Checks required implementation associated items.
///
/// 检查必需的实现关联项目。
fn check_impl_items(
    source: &str,
    config: &CommentCheckConfig,
    items: &[ImplItem],
) -> Result<(), CommentCheckError> {
    for item in items {
        match item {
            ImplConst(item) => check_target_outer_line_doc(source, config, item, &item.attrs)?,
            ImplFn(item) => check_target_outer_line_doc(source, config, item, &item.attrs)?,
            ImplType(item) => check_target_outer_line_doc(source, config, item, &item.attrs)?,
            _ => {}
        }
    }

    Ok(())
}

/// Checks required external block items.
///
/// 检查必需的外部块项目。
fn check_foreign_items(
    source: &str,
    config: &CommentCheckConfig,
    items: &[ForeignItem],
) -> Result<(), CommentCheckError> {
    for item in items {
        match item {
            ForeignFn(item) => check_target_outer_line_doc(source, config, item, &item.attrs)?,
            ForeignStatic(item) => check_target_outer_line_doc(source, config, item, &item.attrs)?,
            _ => {}
        }
    }

    Ok(())
}
