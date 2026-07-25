import type { CustomComponentName, FontFamilyOption } from "#ui";

export const customComponentNames: CustomComponentName[] = [
	"Carousel",
	"Collapsible",
	"Page Break",
];

// Loaded via FontStyles.css
const loadedFonts: FontFamilyOption[] = [
	{ value: "Inter", group: "sans-serif" },
];

// Generic CSS families and web-safe fonts — no loading required
const systemFonts: FontFamilyOption[] = [
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

export const fontFamilyOptions: FontFamilyOption[] = [
	...loadedFonts,
	...systemFonts,
];
