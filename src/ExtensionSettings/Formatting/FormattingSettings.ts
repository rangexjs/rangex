import type { FormattingExtensionSettings } from "@rangex/rich-text-editor/formatting";

const fontFamilyOptions: FormattingExtensionSettings["fontFamilyOptions"] = [
	{ value: "Inter", group: "sans-serif" },
	{ value: "system-ui", group: "sans-serif" },
	{ value: "Arial", group: "sans-serif" },
	{ value: "Helvetica", group: "sans-serif" },
	{ value: "Verdana", group: "sans-serif" },
	{ value: "Tahoma", group: "sans-serif" },
	{ value: "Trebuchet MS", group: "sans-serif" },
	{ value: "Georgia", group: "serif" },
	{ value: "Times New Roman", group: "serif" },
	{ value: "Courier New", group: "monospace" },
	{ value: "monospace", group: "monospace" },
];

export const formattingSettings: FormattingExtensionSettings = {
	fontFamilyOptions,
};
