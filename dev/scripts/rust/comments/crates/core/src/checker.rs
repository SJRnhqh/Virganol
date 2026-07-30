// dev/scripts/rust/comments/crates/core/src/checker.rs
use syn::{parse_file, Fields, ForeignItem, ImplItem, Item, TraitItem};

use super::check_target_outer_doc;

/// Checks required Rust declarations for outer documentation.
///
/// 检查必需的声明是否具有外部文档注释。
pub fn check_source(source: &str) -> Result<(), String> {
    let file = parse_file(source).map_err(|error| error.to_string())?;

    check_items(source, &file.items)
}

/// Checks required item declarations and their nested targets.
///
/// 检查必需的项目声明及其嵌套目标。
fn check_items(source: &str, items: &[Item]) -> Result<(), String> {
    for item in items {
        match item {
            Item::Const(item) => check_target_outer_doc(source, &item.attrs, item)?,
            Item::Enum(item) => {
                check_target_outer_doc(source, &item.attrs, item)?;

                for variant in &item.variants {
                    check_target_outer_doc(source, &variant.attrs, variant)?;
                    check_fields(source, &variant.fields)?;
                }
            }
            Item::Fn(item) => check_target_outer_doc(source, &item.attrs, item)?,
            Item::ForeignMod(item) => check_foreign_items(source, &item.items)?,
            Item::Impl(item) => check_impl_items(source, &item.items)?,
            Item::Macro(item) if item.ident.is_some() => {
                check_target_outer_doc(source, &item.attrs, item)?;
            }
            Item::Mod(item) => {
                if let Some((_, items)) = &item.content {
                    check_items(source, items)?;
                }
            }
            Item::Static(item) => check_target_outer_doc(source, &item.attrs, item)?,
            Item::Struct(item) => {
                check_target_outer_doc(source, &item.attrs, item)?;
                check_fields(source, &item.fields)?;
            }
            Item::Trait(item) => {
                check_target_outer_doc(source, &item.attrs, item)?;
                check_trait_items(source, &item.items)?;
            }
            Item::Type(item) => check_target_outer_doc(source, &item.attrs, item)?,
            Item::Union(item) => {
                check_target_outer_doc(source, &item.attrs, item)?;

                for field in &item.fields.named {
                    check_target_outer_doc(source, &field.attrs, field)?;
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
fn check_fields(source: &str, fields: &Fields) -> Result<(), String> {
    for field in fields {
        check_target_outer_doc(source, &field.attrs, field)?;
    }

    Ok(())
}

/// Checks required trait associated items.
///
/// 检查必需的特征关联项目。
fn check_trait_items(source: &str, items: &[TraitItem]) -> Result<(), String> {
    for item in items {
        match item {
            TraitItem::Const(item) => check_target_outer_doc(source, &item.attrs, item)?,
            TraitItem::Fn(item) => check_target_outer_doc(source, &item.attrs, item)?,
            TraitItem::Type(item) => check_target_outer_doc(source, &item.attrs, item)?,
            _ => {}
        }
    }

    Ok(())
}

/// Checks required implementation associated items.
///
/// 检查必需的实现关联项目。
fn check_impl_items(source: &str, items: &[ImplItem]) -> Result<(), String> {
    for item in items {
        match item {
            ImplItem::Const(item) => check_target_outer_doc(source, &item.attrs, item)?,
            ImplItem::Fn(item) => check_target_outer_doc(source, &item.attrs, item)?,
            ImplItem::Type(item) => check_target_outer_doc(source, &item.attrs, item)?,
            _ => {}
        }
    }

    Ok(())
}

/// Checks required external block items.
///
/// 检查必需的外部块项目。
fn check_foreign_items(source: &str, items: &[ForeignItem]) -> Result<(), String> {
    for item in items {
        match item {
            ForeignItem::Fn(item) => check_target_outer_doc(source, &item.attrs, item)?,
            ForeignItem::Static(item) => check_target_outer_doc(source, &item.attrs, item)?,
            _ => {}
        }
    }

    Ok(())
}
