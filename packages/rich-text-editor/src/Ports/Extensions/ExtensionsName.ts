export const extensionsName = {
	audio: "audio",
	blockQuote: "blockQuote",
	codeBlock: "codeBlock",
	embed: "embed",
	emptyMedia: "emptyMedia",
	formatting: "formatting",
	image: "image",
	link: "link",
	list: "list",
	mention: "mention",
	todoList: "todoList",
	video: "video",
} as const;

export type ExtensionsName = typeof extensionsName;

export type ExtensionName = keyof ExtensionsName;

export type ExtensionNameValue = ExtensionsName[ExtensionName];
