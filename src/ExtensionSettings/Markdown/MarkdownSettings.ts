import type { MarkdownExtensionSettings } from "@rangex/rich-text-editor/markdown";

import { defaultTheme } from "../CodeBlock";

const codeBlockTriggers = [
	{ trigger: "", language: null },
	{ trigger: "ts", language: "typescript" },
	{ trigger: "js", language: "javascript" },
	{ trigger: "py", language: "python" },
	{ trigger: "html", language: "html" },
	{ trigger: "css", language: "css" },
	{ trigger: "json", language: "json" },
].map((codeBlockTrigger) => ({ ...codeBlockTrigger, theme: defaultTheme }));

export const markdownSettings: MarkdownExtensionSettings = {
	codeBlockTriggers,
};
