// src/type/nodes.ts
import { Home, Server, Box, type LucideIcon } from "lucide-react";
import { type Node } from "@xyflow/react";

export const NODE_CATEGORIES = {
  HOME: "home",
  REMOTE: "remote",
  SANDBOX: "sandbox",
} as const;

export type NodeCategory =
  (typeof NODE_CATEGORIES)[keyof typeof NODE_CATEGORIES];

export interface NodeRule {
  label: string;
  icon: LucideIcon;
  maxCount: number; // 数量限制
  defaultName: string;
  allowDelete: boolean;
  actions: string[]; // 该类型节点支持的操作
}

export const NODE_CONFIG: Record<NodeCategory, NodeRule> = {
  [NODE_CATEGORIES.HOME]: {
    label: "Local Machine",
    icon: Home,
    maxCount: 1, // 本地宿主机节点全球唯一
    defaultName: "Local Machine",
    allowDelete: false, // 宿主机不可删除
    actions: ["terminal", "monitor"],
  },
  [NODE_CATEGORIES.REMOTE]: {
    label: "Remote Server",
    icon: Server,
    maxCount: Infinity,
    defaultName: "Remote Server",
    allowDelete: true,
    actions: ["ssh", "sftp", "settings"],
  },
  [NODE_CATEGORIES.SANDBOX]: {
    label: "Sandbox",
    icon: Box,
    maxCount: Infinity,
    defaultName: "Sandbox",
    allowDelete: true,
    actions: ["terminal", "logs"],
  },
};

/**
 * 定义所有节点通用的数据结构 (data 字段)
 * 必须继承 Record<string, unknown> 以兼容 React Flow
 */
export interface BaseNodeData extends Record<string, unknown> {
  name: string;
  // 建议把 status 这种枚举也定义清楚，开发时会有提示
  status: "online" | "offline" | "error" | "connecting";
  description?: string;
  ip?: string; // 如果是远程服务器可能需要 IP
}

/**
 * 全局通用的节点类型 AppNode
 * * 泛型说明：
 * 1. BaseNodeData: 约束 node.data 里的字段
 * 2. NodeCategory: 约束 node.type 必须是你定义的 'home' | 'remote' | 'sandbox'
 */
export type AppNode = Node<BaseNodeData, NodeCategory>;
