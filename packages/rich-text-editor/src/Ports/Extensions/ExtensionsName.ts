export const extensionsName = {
	formatting: "formatting",
	link: "link",
	mention: "mention",
} as const;

export type ExtensionsName = typeof extensionsName;

export type ExtensionName = keyof ExtensionsName;

export type ExtensionNameValue = ExtensionsName[ExtensionName];
