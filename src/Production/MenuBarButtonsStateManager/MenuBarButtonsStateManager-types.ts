import type { menuBarButtonsName } from "../Constants";
import type {
	LanguageMenuBarButtonState,
	TemplateMenuBarButtonState,
	ThemeMenuBarButtonState,
	VimModeMenuBarButtonState,
} from "../MenuBarButtonProps";

// Theme
export interface UpdateThemeStateParams extends ThemeMenuBarButtonState {}
export type UpdateThemeStateFn = (params: UpdateThemeStateParams) => void;

// Template
export interface UpdateTemplateStateParams extends TemplateMenuBarButtonState {}
export type UpdateTemplateStateFn = (params: UpdateTemplateStateParams) => void;

// Vim mode
export interface UpdateVimModeStateParams extends VimModeMenuBarButtonState {}
export type UpdateVimModeStateFn = (params: UpdateVimModeStateParams) => void;

// Language
export interface UpdateLanguageStateParams extends LanguageMenuBarButtonState {}
export type UpdateLanguageStateFn = (params: UpdateLanguageStateParams) => void;

export interface MenuBarButtonsState {
	theme: Partial<ThemeMenuBarButtonState>;
	template: Partial<TemplateMenuBarButtonState>;
	vimMode: Partial<VimModeMenuBarButtonState>;
	language: Partial<LanguageMenuBarButtonState>;
}

export type ListenerMap = {
	[menuBarButtonsName.theme]: UpdateThemeStateFn;
	[menuBarButtonsName.template]: UpdateTemplateStateFn;
	[menuBarButtonsName.vimMode]: UpdateVimModeStateFn;
	[menuBarButtonsName.language]: UpdateLanguageStateFn;
};

export type ListenerOption = {
	[Key in keyof ListenerMap]: { type: Key; callback: ListenerMap[Key] };
}[keyof ListenerMap];

export type UpdateListenerParams = ListenerOption & {
	operation: "add" | "delete";
};

export interface UpdateMenuBarButtonsStateParams
	extends Partial<MenuBarButtonsState> {}
