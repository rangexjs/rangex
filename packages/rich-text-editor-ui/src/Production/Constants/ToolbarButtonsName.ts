export const toolbarButtonsName = {
	anchor: "anchor",
	backgroundColor: "background-color",
	blockQuote: "block-quote",
	bold: "bold",
	checkboxList: "checkbox-list",
	code: "code",
	codeBlock: "code-block",
	color: "color",
	customComponent: "custom-component",
	templateVariable: "template-variable",
	fontFamily: "font-family",
	fontSize: "font-size",
	historyBack: "history-back",
	historyForward: "history-forward",
	indentation: "indentation",
	media: "media",
	textAreaReadability: "text-area-readability",
	italic: "italic",
	letterSpacing: "letter-spacing",
	lineHeight: "line-height",
	removeFormat: "remove-format",
	orderedList: "ordered-list",
	findReplace: "find-replace",
	subscript: "subscript",
	superscript: "superscript",
	strikethrough: "strikethrough",
	symbols: "symbols",
	table: "table",
	lineLocalName: "line-local-name",
	lineSpacing: "line-spacing",
	textAlign: "text-align",
	underline: "underline",
	unorderedList: "unordered-list",
	video: "video",
} as const;

export type ToolbarButtonsName = typeof toolbarButtonsName;

export type ToolbarButtonName = keyof ToolbarButtonsName;

export type ToolbarButtonValue = ToolbarButtonsName[ToolbarButtonName];

export type GetToolbarButtonValue<T extends ToolbarButtonValue> = T;
