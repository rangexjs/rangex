import type {
	CaretMenuConfigPort,
	CaretMenuPublicPort,
	CreateAdapterParams,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export type TemplateVariableKind =
	| "full-name"
	| "first-name"
	| "last-name"
	| "email"
	| "date";

export interface SuggestionItem {
	kind: TemplateVariableKind;
	label: string;
}

export type SuggestionItems = SuggestionItem[];

export interface Options {
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	date: string | null;
}

export interface TemplateVariableState {
	canInsert?: boolean;
	options?: Options;
}

export interface UpdateStateParams extends TemplateVariableState {}

export interface InsertParams {
	kind: TemplateVariableKind;
}

export type OnInsertCallbackFn = (params: InsertParams) => void;
export type OnOptionsCallbackFn = (options: Partial<Options>) => void;
export type OnSelectCallbackFn = (item: SuggestionItem) => void;

export interface TemplateVariableConfigPortProps {
	readonly caretMenu: CaretMenuConfigPort;

	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onOptions(callback: OnOptionsCallbackFn): () => void;
	onSelect(callback: OnSelectCallbackFn): () => void;
}

export interface TemplateVariableConfigPort
	extends TemplateVariableConfigPortProps,
		UnwrapConfigPort {}

export type OnCanInsertUpdateCallbackFn = (value: boolean) => void;
export type OnOptionsUpdateCallbackFn = (value: Options) => void;

export interface TemplateVariablePublicPortProps {
	readonly caretMenu: CaretMenuPublicPort;
	readonly canInsert: boolean;
	readonly options: Options;
	readonly items: SuggestionItems;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onOptionsUpdate(callback: OnOptionsUpdateCallbackFn): () => void;

	insert(params: InsertParams): void;
	changeOptions(options: Partial<Options>): void;
	select(item: SuggestionItem): void;
}

export interface TemplateVariablePublicPort
	extends TemplateVariablePublicPortProps,
		UnwrapPublicPort {}

export interface TemplateVariableInternals {
	canInsert: boolean;
	options: Options;
	items: SuggestionItems;
}

export interface TemplateVariableAdapter {
	configPort: TemplateVariableConfigPort;
	publicPort: TemplateVariablePublicPort;
}

export interface TemplateVariableSettings {}

export interface CreateTemplateVariableAdapterParams
	extends CreateAdapterParams<TemplateVariableSettings> {}

export interface CreateTemplateVariableAdapterResult
	extends TemplateVariableAdapter {}
