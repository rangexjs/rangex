import type { BlockComponent } from "rich-text-area";
import type {
	CreateAdapterParams,
	CurrentComponentConfigPort,
	CurrentComponentPublicPort,
	QuickActionsConfigPort,
	QuickActionsPublicPort,
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
}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapUpdateCallbackFn = (canWrap: boolean) => void;
export type OnIsActiveUpdateCallbackFn = (isActive: boolean) => void;
export type OnLanguageUpdateCallbackFn = (value: CodeBlockLanguage) => void;
export type OnLightThemeUpdateCallbackFn = (value: CodeBlockTheme) => void;
export type OnDarkThemeUpdateCallbackFn = (value: CodeBlockTheme) => void;

export interface PlacementOption {
	language: CodeBlockLanguage;
}

export interface OnInsertCallbackParams extends PlacementOption {}

export type OnInsertCallbackFn = (params: OnInsertCallbackParams) => void;

export interface OnWrapCallbackParams extends PlacementOption {}

export type OnWrapCallbackFn = (params: OnWrapCallbackParams) => void;

export type OnChangeLanguageCallbackFn = (language: CodeBlockLanguage) => void;
export type OnChangeLightThemeCallbackFn = (theme: CodeBlockTheme) => void;
export type OnChangeDarkThemeCallbackFn = (theme: CodeBlockTheme) => void;

export type PlainTextProviderFn = () => string[];

export interface UpdateStateParams extends CodeBlockState {}

export interface CodeBlockConfigPortProps {
	readonly quickActions: QuickActionsConfigPort;

	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
	onChangeLanguage(callback: OnChangeLanguageCallbackFn): () => void;
	onChangeLightTheme(callback: OnChangeLightThemeCallbackFn): () => void;
	onChangeDarkTheme(callback: OnChangeDarkThemeCallbackFn): () => void;
	registerPlainTextProvider(provider: PlainTextProviderFn): void;
}

export interface CodeBlockConfigPort
	extends CodeBlockConfigPortProps,
		RemoveConfigPort,
		UnwrapConfigPort,
		CurrentComponentConfigPort<BlockComponent> {}

export interface InsertParams extends PlacementOption {}

export interface WrapParams extends PlacementOption {}

export interface CodeBlockPublicPortProps {
	readonly quickActions: QuickActionsPublicPort;

	readonly languages: CodeBlockLanguage[];
	readonly themes: CodeBlockTheme[];
	readonly canInsert: boolean;
	readonly canWrap: boolean;
	readonly isActive: boolean;
	readonly language: CodeBlockLanguage;
	readonly lightTheme: CodeBlockTheme;
	readonly darkTheme: CodeBlockTheme;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapUpdateCallbackFn): () => void;
	onIsActiveUpdate(callback: OnIsActiveUpdateCallbackFn): () => void;
	onLanguageUpdate(callback: OnLanguageUpdateCallbackFn): () => void;
	onLightThemeUpdate(callback: OnLightThemeUpdateCallbackFn): () => void;
	onDarkThemeUpdate(callback: OnDarkThemeUpdateCallbackFn): () => void;

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
		UnwrapPublicPort,
		CurrentComponentPublicPort {}

export interface CodeBlockInternals {
	canInsert: boolean;
	canWrap: boolean;
	isActive: boolean;
	language: CodeBlockLanguage;
	lightTheme: CodeBlockTheme;
	darkTheme: CodeBlockTheme;
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
