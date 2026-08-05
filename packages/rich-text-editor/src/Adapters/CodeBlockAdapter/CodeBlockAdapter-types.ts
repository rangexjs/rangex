import type { CreateAdapterConstructor } from "#ports";
import type { EditorOverlayMount, UIOverlayMount } from "../_Utilities";

export type CodeBlockLanguage = string;
export type CodeBlockTheme = string;

export interface CodeBlockSettings {
	languages: CodeBlockLanguage[];
	themes: CodeBlockTheme[];
}

export type CodeBlockAdapterConstructorParams =
	CreateAdapterConstructor<CodeBlockSettings>;

export interface CodeBlockToolbarButtonState {
	disabled: boolean;
}

export interface CodeBlockState {
	toolbarButton?: CodeBlockToolbarButtonState;
	language?: CodeBlockLanguage;
	lightTheme?: CodeBlockTheme;
	darkTheme?: CodeBlockTheme;
	isOpen?: boolean;
}

export interface UpdateCodeBlockStateParams extends CodeBlockState {}

export interface CodeBlockInsertRequestParams {
	language: CodeBlockLanguage;
}

export type CodeBlockUpdateToolbarButtonFn = (
	value: CodeBlockToolbarButtonState,
) => void;
export type CodeBlockUpdateLanguageFn = (value: CodeBlockLanguage) => void;
export type CodeBlockUpdateLightThemeFn = (value: CodeBlockTheme) => void;
export type CodeBlockUpdateDarkThemeFn = (value: CodeBlockTheme) => void;
export type CodeBlockUpdateIsOpenFn = (value: boolean) => void;

export interface CodeBlockUIPort {
	readonly anchoredOverlay: UIOverlayMount;
	readonly toolbarButton: CodeBlockToolbarButtonState;
	readonly languages: CodeBlockLanguage[];
	readonly themes: CodeBlockTheme[];
	readonly language: CodeBlockLanguage;
	readonly lightTheme: CodeBlockTheme;
	readonly darkTheme: CodeBlockTheme;
	onToolbarButtonUpdate(callback: CodeBlockUpdateToolbarButtonFn): () => void;
	onLanguageUpdate(callback: CodeBlockUpdateLanguageFn): () => void;
	onLightThemeUpdate(callback: CodeBlockUpdateLightThemeFn): () => void;
	onDarkThemeUpdate(callback: CodeBlockUpdateDarkThemeFn): () => void;
	onIsOpenUpdate(callback: CodeBlockUpdateIsOpenFn): () => void;
	emitInsertRequest(params: CodeBlockInsertRequestParams): void;
	emitCopy(): void;
	emitLanguageChange(language: CodeBlockLanguage): void;
	emitLightThemeChange(theme: CodeBlockTheme): void;
	emitDarkThemeChange(theme: CodeBlockTheme): void;
}

export type OnCodeBlockInsertRequestFn = (
	params: CodeBlockInsertRequestParams,
) => void;
export type OnCodeBlockCopyFn = () => void;
export type OnCodeBlockLanguageChangeFn = (language: CodeBlockLanguage) => void;
export type OnCodeBlockLightThemeChangeFn = (theme: CodeBlockTheme) => void;
export type OnCodeBlockDarkThemeChangeFn = (theme: CodeBlockTheme) => void;

export interface CodeBlockEditorPort {
	readonly anchoredOverlay: EditorOverlayMount;
	updateState(params: UpdateCodeBlockStateParams): void;
	onInsertRequest(callback: OnCodeBlockInsertRequestFn): () => void;
	onCopy(callback: OnCodeBlockCopyFn): () => void;
	onLanguageChange(callback: OnCodeBlockLanguageChangeFn): () => void;
	onLightThemeChange(callback: OnCodeBlockLightThemeChangeFn): () => void;
	onDarkThemeChange(callback: OnCodeBlockDarkThemeChangeFn): () => void;
}
