import type { CreateAdapterConstructor } from "../_Utilities";

export interface Settings {}

export type ConstructorParams = CreateAdapterConstructor<Settings>;

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
	query?: string;
	isOpen?: boolean;
}

export interface UpdateStateParams extends TemplateVariableState {}

export interface InsertParams {
	kind: TemplateVariableKind;
}

export type OnInsertCallbackFn = (params: InsertParams) => void;
export type OnOptionsCallbackFn = (options: Partial<Options>) => void;
export type OnSelectCallbackFn = (item: SuggestionItem) => void;

export interface TemplateVariableConfigPort {
	readonly floatingEl: HTMLDivElement;

	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onOptions(callback: OnOptionsCallbackFn): () => void;
	onSelect(callback: OnSelectCallbackFn): () => void;
}

export type OnCanInsertUpdateCallbackFn = (value: boolean) => void;
export type OnOptionsUpdateCallbackFn = (value: Options) => void;
export type OnFilteredItemsUpdateCallbackFn = (value: SuggestionItems) => void;
export type OnIsOpenUpdateCallbackFn = (value: boolean) => void;

export interface TemplateVariablePublicPort {
	readonly floatingEl: HTMLDivElement;

	readonly canInsert: boolean;
	readonly options: Options;
	readonly filteredItems: SuggestionItems;
	readonly isOpen: boolean;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onOptionsUpdate(callback: OnOptionsUpdateCallbackFn): () => void;
	onFilteredItemsUpdate(callback: OnFilteredItemsUpdateCallbackFn): () => void;
	onIsOpenUpdate(callback: OnIsOpenUpdateCallbackFn): () => void;

	insert(params: InsertParams): void;
	changeOptions(options: Partial<Options>): void;
	select(item: SuggestionItem): void;
}
