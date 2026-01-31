import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

interface BaseExpandableMenuProps {
  title: React.ReactNode;
  children: React.ReactNode;

  // 非必填：不传则默认关闭
  defaultOpen?: boolean;

  // 可控模式（按需使用）
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // 插槽样式（外部完全控制视觉）
  className?: string; // 容器
  headerClassName?: string; // Header 按钮
  chevronClassName?: string; // Header 内右侧箭头
  contentOuterClassName?: string; // 动画外层（控制 grid-rows, opacity 等）
  contentInnerClassName?: string; // 动画内层（overflow-hidden, padding）

  // 可选：内置图标与箭头
  icon?: React.ReactNode;
  showChevron?: boolean;

  // 折叠策略：hidden（无动画）| grid（grid-rows 动画）
  collapseStrategy?: "hidden" | "grid";
}

export const BaseExpandableMenu = ({
  title,
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  className,
  headerClassName,
  chevronClassName,
  contentOuterClassName,
  contentInnerClassName,
  icon,
  showChevron = true,
  collapseStrategy = "hidden",
}: BaseExpandableMenuProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? !!open : internalOpen;

  const toggle = () => {
    if (isControlled) onOpenChange?.(!isOpen);
    else setInternalOpen((v) => !v);
  };

  const contentId = useId();

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={toggle}
        className={headerClassName}
      >
        <span style={{ display: "inline-flex", gap: 14, alignItems: "center" }}>
          {icon}
          {title}
        </span>

        {showChevron && (
          <ChevronDown aria-hidden className={chevronClassName} />
        )}
      </button>

      {collapseStrategy === "hidden" ? (
        <div
          id={contentId}
          role="region"
          hidden={!isOpen}
          className={contentInnerClassName}
        >
          {children}
        </div>
      ) : (
        <div
          id={contentId}
          role="region"
          className={contentOuterClassName}
          aria-hidden={!isOpen}
        >
          <div className={contentInnerClassName}>{children}</div>
        </div>
      )}
    </div>
  );
};
