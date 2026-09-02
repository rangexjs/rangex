import type {
	CreateAdapterConstructor,
	RemovePort,
	UnwrapPort,
} from "../_Utilities";

export type CodeBlockLanguage = string;
export type CodeBlockTheme = string;

export interface Settings {
	languages?: CodeBlockLanguage[];
	themes?: CodeBlockTheme[];
}

export type ConstructorParams = CreateAdapterConstructor<Settings>;

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

export type OnInsertCallbackFn = () => void;
export type OnWrapCallbackFn = () => void;
export type OnCopyCallbackFn = () => void;
export type OnLanguageCallbackFn = (language: CodeBlockLanguage) => void;
export type OnLightThemeCallbackFn = (theme: CodeBlockTheme) => void;
export type OnDarkThemeCallbackFn = (theme: CodeBlockTheme) => void;
export type PlainTextProviderFn = () => string[];

export interface CodeBlockConfigPort extends RemovePort, UnwrapPort {
	readonly floatingEl: HTMLDivElement;

	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): void;
	onWrap(callback: OnWrapCallbackFn): void;
	onLanguage(callback: OnLanguageCallbackFn): () => void;
	onLightTheme(callback: OnLightThemeCallbackFn): () => void;
	onDarkTheme(callback: OnDarkThemeCallbackFn): () => void;
	registerPlainTextProvider(provider: PlainTextProviderFn): void;
}

export type OnCanInsertCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapCallbackFn = (canWrap: boolean) => void;
export type OnIsActiveCallbackFn = (isActive: boolean) => void;
export type OnLanguageUpdateCallbackFn = (value: CodeBlockLanguage) => void;
export type OnLightThemeUpdateCallbackFn = (value: CodeBlockTheme) => void;
export type OnDarkThemeUpdateCallbackFn = (value: CodeBlockTheme) => void;
export type OnIsOpenUpdateCallbackFn = (value: boolean) => void;

export interface CodeBlockPublicPort {
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

	onCanInsertUpdate(callback: OnCanInsertCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapCallbackFn): () => void;
	onIsActiveUpdate(callback: OnIsActiveCallbackFn): () => void;
	onLanguageUpdate(callback: OnLanguageUpdateCallbackFn): () => void;
	onLightThemeUpdate(callback: OnLightThemeUpdateCallbackFn): () => void;
	onDarkThemeUpdate(callback: OnDarkThemeUpdateCallbackFn): () => void;
	onIsOpenUpdate(callback: OnIsOpenUpdateCallbackFn): () => void;

	insert(): void;
	remove(): void;
	wrap(): void;
	unwrap(): void;
	changeLanguage(language: CodeBlockLanguage): void;
	changeLightTheme(theme: CodeBlockTheme): void;
	changeDarkTheme(theme: CodeBlockTheme): void;

	getPlainText(): string[];
}
