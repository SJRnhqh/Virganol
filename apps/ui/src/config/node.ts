// src/config/nodes.ts
import { Home, Server, Box } from "lucide-react";

export const NODE_CATEGORIES = {
  HOME: "home",
  REMOTE: "remote",
  SANDBOX: "sandbox",
} as const;

export type NodeCategory =
  (typeof NODE_CATEGORIES)[keyof typeof NODE_CATEGORIES];

export interface NodeRule {
  label: string;
  icon: any;
  maxCount: number; // 数量限制
  defaultName: string;
  allowDelete: boolean;
  actions: string[]; // 该类型节点支持的操作
}

export const NODE_CONFIG: Record<NodeCategory, NodeRule> = {
  [NODE_CATEGORIES.HOME]: {
    label: "Local Apiary",
    icon: Home,
    maxCount: 1, // 本地宿主机节点全球唯一
    defaultName: "Home Station",
    allowDelete: false, // 宿主机不可删除
    actions: ["terminal", "monitor"],
  },
  [NODE_CATEGORIES.REMOTE]: {
    label: "Remote Server",
    icon: Server,
    maxCount: Infinity,
    defaultName: "Cloud Server",
    allowDelete: true,
    actions: ["ssh", "sftp", "settings"],
  },
  [NODE_CATEGORIES.SANDBOX]: {
    label: "Docker Crate",
    icon: Box,
    maxCount: Infinity,
    defaultName: "Sandbox",
    allowDelete: true,
    actions: ["terminal", "logs"],
  },
};
