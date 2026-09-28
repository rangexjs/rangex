import type {
	CodeBlockTheme,
	TemplateVariableFields,
	TemplateVariableFieldsConfig,
} from "@rangex/editor";
import { createContext } from "solid-js";

// CodeBlock
export interface CodeBlockLanguageOption {
	label: string;
	value: string | null;
}

export interface CodeBlockThemeOption {
	label: string;
	value: string | null;
}

export interface CodeBlockUIOptions {
	languages?: CodeBlockLanguageOption[];
	themes?: CodeBlockThemeOption[];
	defaultLanguage?: string;
	defaultTheme?: CodeBlockTheme;
}

// Mention
export interface MentionItem {
	userId: string;
	displayName?: string;
	img?: string;
}

export type MentionItems = MentionItem[];

export interface GetMentionItemsParams {
	query: string;
	signal: AbortSignal;
}

export type GetMentionItemsFn = (
	params: GetMentionItemsParams,
) => Promise<MentionItems>;

export interface MentionUIOptions {
	getItems: GetMentionItemsFn;
}

// TemplateVariable
export interface TemplateVariableModalInput<FieldName extends string = string> {
	label: string;
	placeholder?: string;
	patterns?: { value: RegExp; message?: string }[];
	readFields(
		fields: TemplateVariableFields<FieldName>,
		fieldsConfig: TemplateVariableFieldsConfig<FieldName>,
	): string;
}

export interface TemplateVariableModalSettings<
	FieldName extends string = string,
> {
	title: string;
	inputs: TemplateVariableModalInput<FieldName>[];
	onUpdate(
		inputValues: string[],
		fieldsConfig: TemplateVariableFieldsConfig<FieldName>,
	): Partial<TemplateVariableFields<FieldName>>;
}

export interface TemplateVariableDropdownItem<
	FieldName extends string = string,
> {
	label: string;
	fieldName: FieldName;
	settings: TemplateVariableModalSettings<FieldName>;
}

export interface TemplateVariableUIOptions<FieldName extends string = string> {
	dropdown: TemplateVariableDropdownItem<FieldName>[];
}

export interface UIOptions {
	codeBlock?: CodeBlockUIOptions;
	mention?: MentionUIOptions;
	templateVariable?: TemplateVariableUIOptions;
}

export const UIOptionsContext = createContext<UIOptions>();
