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

export interface PreviewAsActionState {
	type: "preview-as";
}

export type MenuBarActionState =
	| ThemeActionState
	| TemplateActionState
	| VimModeActionState
	| LanguageActionState
	| PreviewAsActionState;

export type OnMenuBarParams = MenuBarActionState;
export type OnMenuBarFn = (params: OnMenuBarParams) => void;
export type EmitMenuBarChangeParams = MenuBarActionState;
