// dev/scripts/rust/comments/crates/core/src/checker.rs
use proc_macro2::Span;
use syn::spanned::Spanned;
use syn::{parse_file, AttrStyle, Attribute, Fields, ForeignItem, ImplItem, Item, TraitItem};

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
            Item::Const(item) => require_outer_doc(source, &item.attrs, item)?,
            Item::Enum(item) => {
                require_outer_doc(source, &item.attrs, item)?;

                for variant in &item.variants {
                    require_outer_doc(source, &variant.attrs, variant)?;
                    check_fields(source, &variant.fields)?;
                }
            }
            Item::Fn(item) => require_outer_doc(source, &item.attrs, item)?,
            Item::ForeignMod(item) => check_foreign_items(source, &item.items)?,
            Item::Impl(item) => check_impl_items(source, &item.items)?,
            Item::Macro(item) if item.ident.is_some() => {
                require_outer_doc(source, &item.attrs, item)?;
            }
            Item::Mod(item) => {
                if let Some((_, items)) = &item.content {
                    check_items(source, items)?;
                }
            }
            Item::Static(item) => require_outer_doc(source, &item.attrs, item)?,
            Item::Struct(item) => {
                require_outer_doc(source, &item.attrs, item)?;
                check_fields(source, &item.fields)?;
            }
            Item::Trait(item) => {
                require_outer_doc(source, &item.attrs, item)?;
                check_trait_items(source, &item.items)?;
            }
            Item::Type(item) => require_outer_doc(source, &item.attrs, item)?,
            Item::Union(item) => {
                require_outer_doc(source, &item.attrs, item)?;

                for field in &item.fields.named {
                    require_outer_doc(source, &field.attrs, field)?;
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
        require_outer_doc(source, &field.attrs, field)?;
    }

    Ok(())
}

/// Checks required trait associated items.
///
/// 检查必需的特征关联项目。
fn check_trait_items(source: &str, items: &[TraitItem]) -> Result<(), String> {
    for item in items {
        match item {
            TraitItem::Const(item) => require_outer_doc(source, &item.attrs, item)?,
            TraitItem::Fn(item) => require_outer_doc(source, &item.attrs, item)?,
            TraitItem::Type(item) => require_outer_doc(source, &item.attrs, item)?,
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
            ImplItem::Const(item) => require_outer_doc(source, &item.attrs, item)?,
            ImplItem::Fn(item) => require_outer_doc(source, &item.attrs, item)?,
            ImplItem::Type(item) => require_outer_doc(source, &item.attrs, item)?,
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
            ForeignItem::Fn(item) => require_outer_doc(source, &item.attrs, item)?,
            ForeignItem::Static(item) => require_outer_doc(source, &item.attrs, item)?,
            _ => {}
        }
    }

    Ok(())
}

/// Reports a missing outer document when no documentation evidence exists.
///
/// 在不存在文档证据时报告外部文档缺失。
fn require_outer_doc<T>(source: &str, attrs: &[Attribute], target: &T) -> Result<(), String>
where
    T: Spanned + ?Sized,
{
    if attrs.iter().any(|attribute| {
        matches!(attribute.style, AttrStyle::Outer) && attribute.path().is_ident("doc")
    }) {
        return Ok(());
    }

    let anchor = attrs
        .first()
        .map(|attribute| attribute.span())
        .unwrap_or_else(|| target.span());

    if has_line_comment_candidate_before(source, anchor)? {
        // TODO: Classify and validate non-empty source comment candidates.
        return Ok(());
    }

    Err("missing outer doc comment".to_owned())
}

/// Checks whether a line-comment candidate immediately precedes a target.
///
/// 检查行注释候选是否紧邻目标之前。
fn has_line_comment_candidate_before(source: &str, anchor: Span) -> Result<bool, String> {
    let anchor_offset = anchor.byte_range().start;
    let prefix = source
        .get(..anchor_offset)
        .ok_or_else(|| "invalid source span".to_owned())?;
    let current_line_start = prefix.rfind('\n').map_or(0, |index| index + 1);

    if !prefix[current_line_start..].trim().is_empty() {
        return Ok(false);
    }

    let previous_lines = &prefix[..current_line_start];
    let Some(previous_line) = previous_lines.lines().next_back() else {
        return Ok(false);
    };

    Ok(previous_line.trim_start().starts_with("//"))
}
