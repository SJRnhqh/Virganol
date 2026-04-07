export default {
  parserPreset: {
    parserOpts: {
      headerPattern: /^(?<type>.*\s\w*):\s(?<subject>(?:(?!#).)*(?:(?!\s).))$/,
      headerCorrespondence: ["type", "subject"],
    },
  },
  rules: {
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [2, "always"],
    "header-max-length": [2, "always", 100],
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        // main
        "🌱 init", // 初始化
        "🚀 release", // 发布标记
        // dev分支
        "📦 version", // 开发版本更新
        // version分支
        "🎉 epic", // 大型功能集成（从 feat/* 合并来的完整功能）
        "⚗️ verify", // 版本级验证（蒸馏器 - 更高级的验证）
        "📜 closeout", // 版本文档收尾（CHANGELOG, ROADMAP）
        // feat/*分支
        "📝 docs", // 文档
        "✨ feat", // 新功能
        "🎨 style", // 样式
        "🔧 fix", // 修复
        "🔨 refactor", // 重构
        "🧹 chore", // 杂务
        "🧪 test", // 测试
      ],
    ],
  },
};
