import type {
	CaretMenuConfigPort,
	CaretMenuPublicPort,
	CreateAdapterParams,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export type TemplateVariableFields<FieldName extends string = string> = Record<
	FieldName,
	string
>;

export interface TemplateVariableFieldConfig {
	placeholder: string;
	initialValue?: string;
}

export type TemplateVariableFieldsConfig<FieldName extends string = string> =
	Record<FieldName, TemplateVariableFieldConfig>;

export interface TemplateVariableItem {
	fieldName: string;
}

export type TemplateVariableItems = TemplateVariableItem[];

export interface TemplateVariableState {
	canInsert?: boolean;
	fields?: TemplateVariableFields;
}

export interface UpdateStateParams extends TemplateVariableState {}

export interface InsertParams {
	fieldName: string;
}

export type OnInsertCallbackFn = (params: InsertParams) => void;
export type OnChangeFieldsCallbackFn = (fields: TemplateVariableFields) => void;
export type OnSelectCallbackFn = (item: TemplateVariableItem) => void;

export interface TemplateVariableConfigPortProps {
	readonly caretMenu: CaretMenuConfigPort;
	readonly fieldsConfig: TemplateVariableFieldsConfig;

	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onChangeFields(callback: OnChangeFieldsCallbackFn): () => void;
	onSelect(callback: OnSelectCallbackFn): () => void;
}

export interface TemplateVariableConfigPort
	extends TemplateVariableConfigPortProps,
		UnwrapConfigPort {}

export type OnCanInsertUpdateCallbackFn = (value: boolean) => void;
export type OnFieldsUpdateCallbackFn = (value: TemplateVariableFields) => void;

export interface TemplateVariablePublicPortProps {
	readonly caretMenu: CaretMenuPublicPort;
	readonly canInsert: boolean;
	readonly fields: TemplateVariableFields;
	readonly fieldsConfig: TemplateVariableFieldsConfig;
	readonly items: TemplateVariableItems;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onFieldsUpdate(callback: OnFieldsUpdateCallbackFn): () => void;

	insert(params: InsertParams): void;
	changeFields(fields: TemplateVariableFields): void;
	select(item: TemplateVariableItem): void;
}

export interface TemplateVariablePublicPort
	extends TemplateVariablePublicPortProps,
		UnwrapPublicPort {}

export interface TemplateVariableInternals {
	canInsert: boolean;
	fields: TemplateVariableFields;
	fieldsConfig: TemplateVariableFieldsConfig;
	items: TemplateVariableItems;
}

export interface TemplateVariableAdapter {
	configPort: TemplateVariableConfigPort;
	publicPort: TemplateVariablePublicPort;
}

export interface TemplateVariableSettings {
	fieldsConfig: TemplateVariableFieldsConfig;
}

export interface CreateTemplateVariableAdapterParams
	extends CreateAdapterParams<TemplateVariableSettings> {}

export interface CreateTemplateVariableAdapterResult
	extends TemplateVariableAdapter {}
