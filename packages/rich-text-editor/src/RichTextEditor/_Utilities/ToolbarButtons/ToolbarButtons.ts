import type { ToolbarButtons } from "#ports";

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
			"media",
			"custom-component",
			"symbols",
			"link",
			"template-variable",
		],
		["find-replace", "read-only"],
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
