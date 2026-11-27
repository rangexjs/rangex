import type { ResolvePlaceholderFn } from "@rangex/rich-text-editor";

const commandsHint = "Press / for commands…";

export const resolvePlaceholder: ResolvePlaceholderFn = (context) => {
  const { isFocused, owner, line } = context;

  if (owner === "root" && !isFocused) {
    return { text: commandsHint, showWhen: "empty editable" };
  }

  if (line.localName !== "p") {
    const level = line.localName.slice(1);

    return { text: `Heading ${level}`, showWhen: "caret in empty line" };
  }

  if (owner === "root") {
    return { text: commandsHint, showWhen: "caret in empty line" };
  }

  if (owner === "block-quote") {
    return { text: "Quote", showWhen: "caret in empty line" };
  }

  return null;
};
