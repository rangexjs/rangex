export const extensionsName = {
	audio: "audio",
	embed: "embed",
	emptyMedia: "emptyMedia",
	formatting: "formatting",
	image: "image",
	link: "link",
	mention: "mention",
	video: "video",
} as const;

export type ExtensionsName = typeof extensionsName;

export type ExtensionName = keyof ExtensionsName;

export type ExtensionNameValue = ExtensionsName[ExtensionName];
