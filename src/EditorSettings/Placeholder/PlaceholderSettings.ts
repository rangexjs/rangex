import type { PlaceholderLine, ResolvePlaceholderFn } from "@rangex/rich-text-editor";

type HeadingLocalName = Exclude<PlaceholderLine["localName"], "p">;

const commandsHint = "Press / for commands…";

const getHeadingText = (localName: HeadingLocalName) => {
  const level = localName.slice(1);

  const headingText = `Heading ${level}`;

  return headingText;
};

export const resolvePlaceholder: ResolvePlaceholderFn = (context) => {
  const { isFocused, owner, line } = context;

  const { localName } = line;

  if (owner === "root") {
    const showWhen = isFocused ? "caret in empty line" : "empty editable";

    const text = localName === "p" ? commandsHint : getHeadingText(localName);

    return { text, showWhen };
  }

  if (localName !== "p") {
    const text = getHeadingText(localName);

    return { text, showWhen: "caret in empty line" };
  }

  return null;
};
