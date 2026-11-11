import type {
	CaretMenuConfigPort,
	CaretMenuPublicPort,
	CreateAdapterParams,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export type TemplateVariableFields<FieldName extends string = string> = Record<FieldName, string>;

export interface TemplateVariableFieldConfig {
	placeholder: string;
	initialValue?: string;
}

export type TemplateVariableFieldsConfig<FieldName extends string = string> = Record<
	FieldName,
	TemplateVariableFieldConfig
>;

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

export interface FieldMismatch {
	reason: string;
}

export type ValidateFieldNameResult = FieldMismatch | null;
export type ValidateFieldValueResult = FieldMismatch | null;

export type OnInsertCallbackFn = (params: InsertParams) => void;
export type OnChangeFieldsCallbackFn = (fields: TemplateVariableFields) => void;
export type OnSelectCallbackFn = (item: TemplateVariableItem) => void;
export type ValidateFieldNameProviderFn = (fieldName: string) => ValidateFieldNameResult;
export type ValidateFieldValueProviderFn = (value: string) => ValidateFieldValueResult;

export interface TemplateVariableConfigPortProps {
	readonly caretMenu: CaretMenuConfigPort;
	readonly fieldsConfig: TemplateVariableFieldsConfig;

	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onChangeFields(callback: OnChangeFieldsCallbackFn): () => void;
	onSelect(callback: OnSelectCallbackFn): () => void;

	registerValidateFieldName(provider: ValidateFieldNameProviderFn): void;
	registerValidateFieldValue(provider: ValidateFieldValueProviderFn): void;
}

export interface TemplateVariableConfigPort
	extends TemplateVariableConfigPortProps, UnwrapConfigPort {}

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

	validateFieldName(fieldName: string): ValidateFieldNameResult;
	validateFieldValue(value: string): ValidateFieldValueResult;
}

export interface TemplateVariablePublicPort
	extends TemplateVariablePublicPortProps, UnwrapPublicPort {}

export interface TemplateVariableInternals {
	fieldsConfig: TemplateVariableFieldsConfig;
	items: TemplateVariableItems;
	// Providers
	validateFieldNameProvider: ValidateFieldNameProviderFn | null;
	validateFieldValueProvider: ValidateFieldValueProviderFn | null;
}

export interface TemplateVariableAdapter {
	configPort: TemplateVariableConfigPort;
	publicPort: TemplateVariablePublicPort;
}

export interface TemplateVariableSettings {
	fieldsConfig: TemplateVariableFieldsConfig;
}

export interface CreateTemplateVariableAdapterParams extends CreateAdapterParams<TemplateVariableSettings> {}

export interface CreateTemplateVariableAdapterResult extends TemplateVariableAdapter {}
