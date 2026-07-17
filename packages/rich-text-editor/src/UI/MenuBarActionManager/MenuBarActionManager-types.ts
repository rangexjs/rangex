import type { menuBarButtonsName } from "../Constants";
import type { TemplateValue, ThemeValue } from "../MenuBarButtonProps";

export interface ThemeActionState {
	type: typeof menuBarButtonsName.theme;
	newValue: ThemeValue;
}

export interface TemplateActionState {
	type: typeof menuBarButtonsName.template;
	newValue: TemplateValue;
}

export interface VimModeActionState {
	type: typeof menuBarButtonsName.vimMode;
	newValue: boolean;
}

export interface LanguageActionState {
	type: typeof menuBarButtonsName.language;
	newValue: string;
}

export interface PreviewActionState {
	type: typeof menuBarButtonsName.preview;
}

export type MenuBarActionState =
	| ThemeActionState
	| TemplateActionState
	| VimModeActionState
	| LanguageActionState
	| PreviewActionState;

export type OnMenuBarParams = MenuBarActionState;
export type OnMenuBarFn = (params: OnMenuBarParams) => void;
export type EmitMenuBarChangeParams = MenuBarActionState;
