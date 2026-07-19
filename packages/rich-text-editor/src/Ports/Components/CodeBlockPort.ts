export type CodeBlockLanguage = string;
export type CodeBlockTheme = string;

export interface CodeBlockPopoverState {
	language?: CodeBlockLanguage;
	lightTheme?: CodeBlockTheme;
	darkTheme?: CodeBlockTheme;
}

export interface UpdateCodeBlockPopoverStateParams
	extends CodeBlockPopoverState {}

export type OnCopyFn = () => void;
export type OnLanguageChangeFn = (language: CodeBlockLanguage) => void;
export type OnLightThemeChangeFn = (theme: CodeBlockTheme) => void;
export type OnDarkThemeChangeFn = (theme: CodeBlockTheme) => void;

export interface CodeBlockPort {
	popover: HTMLDivElement;
	updateState(params: UpdateCodeBlockPopoverStateParams): void;
	onCopy(callback: OnCopyFn): () => void;
	onLanguageChange(callback: OnLanguageChangeFn): () => void;
	onLightThemeChange(callback: OnLightThemeChangeFn): () => void;
	onDarkThemeChange(callback: OnDarkThemeChangeFn): () => void;
}
