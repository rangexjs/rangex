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

export interface CodeBlockTheme {
	light: string;
	dark: string;
}

export interface GetHighlightInfoParams {
	lines: string[];
	language: string;
	theme: CodeBlockTheme;
}

export interface ThemedChars {
	colors: CodeBlockTheme;
	content: string;
}

export type ThemedCodeLine = ThemedChars[];

export type ThemedCodeLines = ThemedCodeLine[];

export interface HighlightInfo {
	backgrounds: CodeBlockTheme;
	foregrounds: CodeBlockTheme;
	codeLines: ThemedCodeLines;
}

export type GetHighlightInfoFn = (
	params: GetHighlightInfoParams,
) => Promise<HighlightInfo | null>;

export interface CodeBlockState {
	canInsert?: boolean;
	canWrap?: boolean;
	language?: string | null;
	theme?: CodeBlockTheme | null;
}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapUpdateCallbackFn = (canWrap: boolean) => void;
export type OnLanguageUpdateCallbackFn = (value: string | null) => void;
export type OnThemeUpdateCallbackFn = (value: CodeBlockTheme | null) => void;

export interface CodeBlockPlacementOption {
	language: string | null;
	theme: CodeBlockTheme | null;
}

export interface OnInsertCallbackParams extends CodeBlockPlacementOption {}

export type OnInsertCallbackFn = (params: OnInsertCallbackParams) => void;

export interface OnWrapCallbackParams extends CodeBlockPlacementOption {}

export type OnWrapCallbackFn = (params: OnWrapCallbackParams) => void;

export type OnChangeLanguageCallbackFn = (language: string | null) => void;
export type OnChangeThemeCallbackFn = (theme: CodeBlockTheme | null) => void;

export type PlainTextProviderFn = () => string[];

export interface UpdateStateParams extends CodeBlockState {}

export interface CodeBlockConfigPortProps {
	readonly quickActions: QuickActionsConfigPort;
	readonly getHighlightInfo: GetHighlightInfoFn | null;

	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
	onChangeLanguage(callback: OnChangeLanguageCallbackFn): () => void;
	onChangeTheme(callback: OnChangeThemeCallbackFn): () => void;
	registerPlainTextProvider(provider: PlainTextProviderFn): void;
}

export interface CodeBlockConfigPort
	extends CodeBlockConfigPortProps,
		RemoveConfigPort,
		UnwrapConfigPort,
		CurrentComponentConfigPort<BlockComponent> {}

export interface InsertParams extends CodeBlockPlacementOption {}

export interface WrapParams extends CodeBlockPlacementOption {}

export interface CodeBlockPublicPortProps {
	readonly quickActions: QuickActionsPublicPort;

	readonly canHighlight: boolean;
	readonly canInsert: boolean;
	readonly canWrap: boolean;
	readonly language: string | null;
	readonly theme: CodeBlockTheme | null;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapUpdateCallbackFn): () => void;
	onLanguageUpdate(callback: OnLanguageUpdateCallbackFn): () => void;
	onThemeUpdate(callback: OnThemeUpdateCallbackFn): () => void;

	insert(params: InsertParams): void;
	wrap(params: WrapParams): void;
	changeLanguage(language: string | null): void;
	changeTheme(theme: CodeBlockTheme | null): void;

	getPlainText(): string[];
}

export interface CodeBlockPublicPort
	extends CodeBlockPublicPortProps,
		RemovePublicPort,
		UnwrapPublicPort,
		CurrentComponentPublicPort {}

export interface CodeBlockInternals {
	getHighlightInfo: GetHighlightInfoFn | null;
	canInsert: boolean;
	canWrap: boolean;
	language: string | null;
	theme: CodeBlockTheme | null;
	plainTextProvider: PlainTextProviderFn | null;
}

export interface CodeBlockAdapter {
	configPort: CodeBlockConfigPort;
	publicPort: CodeBlockPublicPort;
}

export interface CodeBlockSettings {
	getHighlightInfo?: GetHighlightInfoFn;
}

export interface CreateCodeBlockAdapterParams
	extends CreateAdapterParams<CodeBlockSettings> {}

export interface CreateCodeBlockAdapterResult extends CodeBlockAdapter {}
