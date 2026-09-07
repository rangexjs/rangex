import type {
	CreateAdapterParams,
	RemoveConfigPort,
	RemovePublicPort,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export type CodeBlockLanguage = string;
export type CodeBlockTheme = string;

export interface CodeBlockState {
	canInsert?: boolean;
	canWrap?: boolean;
	isActive?: boolean;
	language?: CodeBlockLanguage;
	lightTheme?: CodeBlockTheme;
	darkTheme?: CodeBlockTheme;
	isOpen?: boolean;
}

export interface UpdateStateParams extends CodeBlockState {}

export interface PlacementOption {
	language: CodeBlockLanguage;
}

export interface OnInsertCallbackParams extends PlacementOption {}

export type OnInsertCallbackFn = (params: OnInsertCallbackParams) => void;

export interface OnWrapCallbackParams extends PlacementOption {}

export type OnWrapCallbackFn = (params: OnWrapCallbackParams) => void;

export type OnCopyCallbackFn = () => void;
export type OnLanguageCallbackFn = (language: CodeBlockLanguage) => void;
export type OnLightThemeCallbackFn = (theme: CodeBlockTheme) => void;
export type OnDarkThemeCallbackFn = (theme: CodeBlockTheme) => void;
export type PlainTextProviderFn = () => string[];

export interface CodeBlockConfigPortProps {
	readonly floatingEl: HTMLDivElement;

	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
	onLanguage(callback: OnLanguageCallbackFn): () => void;
	onLightTheme(callback: OnLightThemeCallbackFn): () => void;
	onDarkTheme(callback: OnDarkThemeCallbackFn): () => void;
	registerPlainTextProvider(provider: PlainTextProviderFn): void;
}

export interface CodeBlockConfigPort
	extends CodeBlockConfigPortProps,
		RemoveConfigPort,
		UnwrapConfigPort {}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapUpdateCallbackFn = (canWrap: boolean) => void;
export type OnIsActiveUpdateCallbackFn = (isActive: boolean) => void;
export type OnLanguageUpdateCallbackFn = (value: CodeBlockLanguage) => void;
export type OnLightThemeUpdateCallbackFn = (value: CodeBlockTheme) => void;
export type OnDarkThemeUpdateCallbackFn = (value: CodeBlockTheme) => void;
export type OnIsOpenUpdateCallbackFn = (value: boolean) => void;

export interface InsertParams extends PlacementOption {}

export interface WrapParams extends PlacementOption {}

export interface CodeBlockPublicPortProps {
	readonly floatingEl: HTMLDivElement;

	readonly languages: CodeBlockLanguage[];
	readonly themes: CodeBlockTheme[];
	readonly canInsert: boolean;
	readonly canWrap: boolean;
	readonly isActive: boolean;
	readonly language: CodeBlockLanguage;
	readonly lightTheme: CodeBlockTheme;
	readonly darkTheme: CodeBlockTheme;
	readonly isOpen: boolean;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapUpdateCallbackFn): () => void;
	onIsActiveUpdate(callback: OnIsActiveUpdateCallbackFn): () => void;
	onLanguageUpdate(callback: OnLanguageUpdateCallbackFn): () => void;
	onLightThemeUpdate(callback: OnLightThemeUpdateCallbackFn): () => void;
	onDarkThemeUpdate(callback: OnDarkThemeUpdateCallbackFn): () => void;
	onIsOpenUpdate(callback: OnIsOpenUpdateCallbackFn): () => void;

	insert(params: InsertParams): void;
	wrap(params: WrapParams): void;
	changeLanguage(language: CodeBlockLanguage): void;
	changeLightTheme(theme: CodeBlockTheme): void;
	changeDarkTheme(theme: CodeBlockTheme): void;

	getPlainText(): string[];
}

export interface CodeBlockPublicPort
	extends CodeBlockPublicPortProps,
		RemovePublicPort,
		UnwrapPublicPort {}

export interface CodeBlockInternals {
	canInsert: boolean;
	canWrap: boolean;
	isActive: boolean;
	language: CodeBlockLanguage;
	lightTheme: CodeBlockTheme;
	darkTheme: CodeBlockTheme;
	isOpen: boolean;
	plainTextProvider: PlainTextProviderFn | null;
}

export interface CodeBlockAdapter {
	configPort: CodeBlockConfigPort;
	publicPort: CodeBlockPublicPort;
}

export interface CodeBlockSettings {
	languages?: CodeBlockLanguage[];
	themes?: CodeBlockTheme[];
}

export interface CreateCodeBlockAdapterParams
	extends CreateAdapterParams<CodeBlockSettings> {}

export interface CreateCodeBlockAdapterResult extends CodeBlockAdapter {}
