import type {
	CodeBlockLanguage,
	CodeBlockTheme,
} from "../../ToolbarButtonProps";

export interface CodeBlockPopoverState {
	language?: CodeBlockLanguage;
	lightTheme?: CodeBlockTheme;
	darkTheme?: CodeBlockTheme;
}

export interface UpdateCodeBlockPopoverStateParams
	extends CodeBlockPopoverState {}

export type UpdateLanguageFn = (value: CodeBlockLanguage) => void;
export type UpdateLightThemeFn = (value: CodeBlockTheme) => void;
export type UpdateDarkThemeFn = (value: CodeBlockTheme) => void;

export type CodeBlockListenerOption =
	| { type: "language"; callback: UpdateLanguageFn }
	| { type: "lightTheme"; callback: UpdateLightThemeFn }
	| { type: "darkTheme"; callback: UpdateDarkThemeFn };

export type CodeBlockUpdateListenerParams = CodeBlockListenerOption & {
	operation: "add" | "delete";
};

export type OnCopyFn = () => void;
export type OnLanguageChangeFn = (language: CodeBlockLanguage) => void;
export type OnLightThemeChangeFn = (theme: CodeBlockTheme) => void;
export type OnDarkThemeChangeFn = (theme: CodeBlockTheme) => void;

export interface CodeBlockPopover {
	popover: HTMLDivElement;
	updateState(params: UpdateCodeBlockPopoverStateParams): void;
	onCopy(callback: OnCopyFn): () => void;
	onLanguageChange(callback: OnLanguageChangeFn): () => void;
	onLightThemeChange(callback: OnLightThemeChangeFn): () => void;
	onDarkThemeChange(callback: OnDarkThemeChangeFn): () => void;
}
