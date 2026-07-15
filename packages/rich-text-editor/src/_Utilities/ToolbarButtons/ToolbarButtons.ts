import type { ToolbarButtons } from "@rangex/rich-text-editor-ui";

export const toolbarButtons: ToolbarButtons = [
	[
		["history-back", "history-forward"],
		[
			"table",
			"unordered-list",
			"ordered-list",
			"checkbox-list",
			"code-block",
			"block-quote",
			"video",
			"media",
			"custom-component",
			"symbols",
			"anchor",
		],
		["find-replace", "template-variable", "text-area-readability"],
	],
	[
		["line-local-name"],
		[
			"bold",
			"italic",
			"underline",
			"strikethrough",
			"color",
			"background-color",
			"letter-spacing",
			"font-size",
			"font-family",
			"subscript",
			"superscript",
			"code",
			"remove-format",
		],
		["text-align", "line-height", "indentation", "line-spacing"],
	],
];
