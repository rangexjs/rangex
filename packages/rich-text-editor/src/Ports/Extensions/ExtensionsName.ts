export const extensionsName = {
	accordionItem: "accordionItem",
	audio: "audio",
	blockQuote: "blockQuote",
	codeBlock: "codeBlock",
	embed: "embed",
	emoji: "emoji",
	emptyMedia: "emptyMedia",
	findReplace: "findReplace",
	formatting: "formatting",
	image: "image",
	link: "link",
	list: "list",
	mention: "mention",
	symbols: "symbols",
	table: "table",
	templateVariable: "templateVariable",
	todoList: "todoList",
	undoRedo: "undoRedo",
	video: "video",
} as const;

export type ExtensionsName = typeof extensionsName;

export type ExtensionName = keyof ExtensionsName;

export type ExtensionNameValue = ExtensionsName[ExtensionName];
