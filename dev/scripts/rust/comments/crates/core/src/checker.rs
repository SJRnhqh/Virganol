// dev/scripts/rust/comments/crates/core/src/checker.rs
use syn::{parse_file, Fields, ForeignItem, ImplItem, Item, TraitItem};

use super::{check_target_outer_line_doc, CommentCheckConfig, CommentCheckError};

/// Checks required Rust declarations for outer line documentation.
///
/// 检查必需的声明是否具有外部行文档注释。
pub fn check_source(source: &str, config: &CommentCheckConfig) -> Result<(), CommentCheckError> {
    let file = parse_file(source).map_err(|_| CommentCheckError::parse())?;

    check_items(source, &file.items, config)
}

/// Checks required item declarations and their nested targets.
///
/// 检查必需的项目声明及其嵌套目标。
fn check_items(
    source: &str,
    items: &[Item],
    config: &CommentCheckConfig,
) -> Result<(), CommentCheckError> {
    for item in items {
        match item {
            Item::Const(item) => check_target_outer_line_doc(source, &item.attrs, item, config)?,
            Item::Enum(item) => {
                check_target_outer_line_doc(source, &item.attrs, item, config)?;

                for variant in &item.variants {
                    check_target_outer_line_doc(source, &variant.attrs, variant, config)?;
                    check_fields(source, &variant.fields, config)?;
                }
            }
            Item::Fn(item) => check_target_outer_line_doc(source, &item.attrs, item, config)?,
            Item::ForeignMod(item) => check_foreign_items(source, &item.items, config)?,
            Item::Impl(item) => check_impl_items(source, &item.items, config)?,
            Item::Macro(item) if item.ident.is_some() => {
                check_target_outer_line_doc(source, &item.attrs, item, config)?;
            }
            Item::Mod(item) => {
                if let Some((_, items)) = &item.content {
                    check_items(source, items, config)?;
                }
            }
            Item::Static(item) => check_target_outer_line_doc(source, &item.attrs, item, config)?,
            Item::Struct(item) => {
                check_target_outer_line_doc(source, &item.attrs, item, config)?;
                check_fields(source, &item.fields, config)?;
            }
            Item::Trait(item) => {
                check_target_outer_line_doc(source, &item.attrs, item, config)?;
                check_trait_items(source, &item.items, config)?;
            }
            Item::Type(item) => check_target_outer_line_doc(source, &item.attrs, item, config)?,
            Item::Union(item) => {
                check_target_outer_line_doc(source, &item.attrs, item, config)?;

                for field in &item.fields.named {
                    check_target_outer_line_doc(source, &field.attrs, field, config)?;
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
    fields: &Fields,
    config: &CommentCheckConfig,
) -> Result<(), CommentCheckError> {
    for field in fields {
        check_target_outer_line_doc(source, &field.attrs, field, config)?;
    }

    Ok(())
}

/// Checks required trait associated items.
///
/// 检查必需的特征关联项目。
fn check_trait_items(
    source: &str,
    items: &[TraitItem],
    config: &CommentCheckConfig,
) -> Result<(), CommentCheckError> {
    for item in items {
        match item {
            TraitItem::Const(item) => {
                check_target_outer_line_doc(source, &item.attrs, item, config)?
            }
            TraitItem::Fn(item) => check_target_outer_line_doc(source, &item.attrs, item, config)?,
            TraitItem::Type(item) => {
                check_target_outer_line_doc(source, &item.attrs, item, config)?
            }
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
    items: &[ImplItem],
    config: &CommentCheckConfig,
) -> Result<(), CommentCheckError> {
    for item in items {
        match item {
            ImplItem::Const(item) => {
                check_target_outer_line_doc(source, &item.attrs, item, config)?
            }
            ImplItem::Fn(item) => check_target_outer_line_doc(source, &item.attrs, item, config)?,
            ImplItem::Type(item) => check_target_outer_line_doc(source, &item.attrs, item, config)?,
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
    items: &[ForeignItem],
    config: &CommentCheckConfig,
) -> Result<(), CommentCheckError> {
    for item in items {
        match item {
            ForeignItem::Fn(item) => {
                check_target_outer_line_doc(source, &item.attrs, item, config)?
            }
            ForeignItem::Static(item) => {
                check_target_outer_line_doc(source, &item.attrs, item, config)?
            }
            _ => {}
        }
    }

    Ok(())
}
