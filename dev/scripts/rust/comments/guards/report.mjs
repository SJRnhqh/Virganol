// dev/scripts/rust/comments/guards/report.mjs
const ansi = {
  accent: "\u001B[36m",
  border: "\u001B[90m",
  failure: "\u001B[1;31m",
  heading: "\u001B[1m",
  reset: "\u001B[0m",
  success: "\u001B[1;32m",
  warning: "\u001B[33m",
};
const ansiPattern = /\u001B\[[0-9;]*m/g;

function style(enabled, tone, value) {
  const text = String(value);

  return enabled && tone ? `${ansi[tone]}${text}${ansi.reset}` : text;
}

function visibleLength(value) {
  return value.replace(ansiPattern, "").length;
}

function formatTable(rows, colorsEnabled) {
  const labelWidth = Math.max(...rows.map(([label]) => label.length));

  return rows.map(([label, value, tone]) => {
    const formattedLabel = style(colorsEnabled, "border", label.padEnd(labelWidth));
    const formattedValue = style(colorsEnabled, tone, value === "" ? "<empty>" : value);

    return `${formattedLabel}  ${formattedValue}`;
  });
}

function configTone(path, value) {
  if (path.length === 1 && path[0] === "tolerance") {
    return value === "immediate" ? "warning" : "accent";
  }

  return "accent";
}

function formatConfig(value, colorsEnabled, depth = 0, path = []) {
  const indentation = "  ".repeat(depth);

  if (Array.isArray(value)) {
    if (value.length === 0) return [`${indentation}${style(colorsEnabled, "accent", "[]")}`];

    return value.flatMap((item) => {
      const bullet = style(colorsEnabled, "border", "•");

      if (item && typeof item === "object") {
        return [`${indentation}${bullet}`, ...formatConfig(item, colorsEnabled, depth + 1, path)];
      }

      return [
        `${indentation}${bullet} ${style(colorsEnabled, configTone(path, item), item === "" ? "<empty>" : item)}`,
      ];
    });
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);

    if (entries.length === 0) return [`${indentation}${style(colorsEnabled, "accent", "{}")}`];

    const scalarKeys = entries
      .filter(([, item]) => !item || typeof item !== "object")
      .map(([key]) => key.length);
    const labelWidth = Math.max(0, ...scalarKeys);

    return entries.flatMap(([key, item]) => {
      const nextPath = [...path, key];

      if (item && typeof item === "object") {
        return [
          `${indentation}${style(colorsEnabled, "border", key)}`,
          ...formatConfig(item, colorsEnabled, depth + 1, nextPath),
        ];
      }

      const label = style(colorsEnabled, "border", key.padEnd(labelWidth));
      const formattedValue = style(
        colorsEnabled,
        configTone(nextPath, item),
        item === "" ? "<empty>" : item
      );

      return [`${indentation}${label}  ${formattedValue}`];
    });
  }

  return [`${indentation}${style(colorsEnabled, configTone(path, value), value)}`];
}

function namedBorder(left, right, title, innerWidth, colorsEnabled) {
  const trailingBorder = `${"─".repeat(innerWidth - title.length - 1)}${right}`;

  return `${style(colorsEnabled, "border", `${left}─`)} ${style(colorsEnabled, "heading", title)} ${style(colorsEnabled, "border", trailingBorder)}`;
}

function reportBoxLines(write, lines, innerWidth, colorsEnabled) {
  for (const line of lines) {
    const padding = " ".repeat(innerWidth - visibleLength(line));

    write(
      `${style(colorsEnabled, "border", "│")} ${line}${padding} ${style(colorsEnabled, "border", "│")}`
    );
  }
}

function reportCard(write, title, rows, config, colorsEnabled) {
  const summaryLines = formatTable(rows, colorsEnabled);
  const configLines = formatConfig(config, colorsEnabled);
  const innerWidth = Math.max(
    title.length + 1,
    "config".length + 1,
    ...[...summaryLines, ...configLines].map(visibleLength)
  );

  write(namedBorder("┌", "┐", title, innerWidth, colorsEnabled));
  reportBoxLines(write, summaryLines, innerWidth, colorsEnabled);
  write(namedBorder("├", "┤", "config", innerWidth, colorsEnabled));
  reportBoxLines(write, configLines, innerWidth, colorsEnabled);

  write(style(colorsEnabled, "border", `└${"─".repeat(innerWidth + 2)}┘`));
  write("");
}

function reportDiagnostic(write, diagnostic, colorsEnabled) {
  const { relativePath, line, code, ...details } = diagnostic;
  const location = line ? `${relativePath}:${line}` : relativePath;

  const rows = [
    ["location", location, "accent"],
    ["code", code, "failure"],
    ...Object.entries(details).map(([label, value]) => [label, value]),
  ];

  for (const row of formatTable(rows, colorsEnabled)) write(row);
  write("");
}

export function reportGuardResult({
  guardName,
  config,
  targetCount,
  checkedCount,
  diagnostics,
}) {
  const failed = diagnostics.length > 0;
  const stream = failed ? process.stderr : process.stdout;
  const colorsEnabled = Boolean(stream.isTTY) && !("NO_COLOR" in process.env);
  const write = (message) => stream.write(`${message}\n`);

  reportCard(
    write,
    `${guardName} guard`,
    [
      ["status", failed ? "FAIL" : "PASS", failed ? "failure" : "success"],
      ["checked", `${checkedCount} / ${targetCount} files`],
      ["diagnostics", diagnostics.length, failed ? "failure" : "success"],
    ],
    config,
    colorsEnabled
  );

  for (const diagnostic of diagnostics) {
    reportDiagnostic(write, diagnostic, colorsEnabled);
  }
}
