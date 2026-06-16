export const menuBarButtonsName = {
	theme: "theme",
	template: "template",
	vimMode: "vimMode",
	language: "language",
	preview: "preview",
} as const;

export type MenuBarButtonsName = typeof menuBarButtonsName;
export type MenuBarButtonName = keyof MenuBarButtonsName;
export type MenuBarButtonValue = MenuBarButtonsName[MenuBarButtonName];
