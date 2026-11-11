import type { CodeBlockTheme } from "@rangex/editor/code-block";
import type {
	TableCellResizingAction,
	TableCellTypeAction,
	TableInsertDeleteAction,
	TableMergeSplitAction,
	TableSectionTypeAction,
	TableVerticalAlignmentAction,
} from "@rangex/editor/table";
import type {
	TemplateVariableFields,
	TemplateVariableFieldsConfig,
} from "@rangex/editor/template-variable";
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

// Formatting
export interface FontFamilyOption {
	value: string;
	group: "sans-serif" | "serif" | "monospace";
}

export interface FormattingUIOptions {
	fontFamilyOptions?: FontFamilyOption[];
}

// Mention
export interface MentionItem {
	userId: string;
	displayText?: string;
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

// Table
export interface TableContextMenuUIOptions {
	sectionType?: TableSectionTypeAction[];
	mergeSplit?: TableMergeSplitAction[];
	insertDelete?: TableInsertDeleteAction[];
	cellType?: TableCellTypeAction[];
	verticalAlignment?: TableVerticalAlignmentAction[];
	cellResizing?: TableCellResizingAction[];
	clearContents?: boolean;
}

export interface TableUIOptions {
	contextMenu?: TableContextMenuUIOptions;
}

export interface UIOptions {
	codeBlock?: CodeBlockUIOptions;
	formatting?: FormattingUIOptions;
	mention?: MentionUIOptions;
	table?: TableUIOptions;
	templateVariable?: TemplateVariableUIOptions;
}

export const UIOptionsContext = createContext<UIOptions>();
