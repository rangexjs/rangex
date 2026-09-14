import type {
	TemplateVariableKind,
	TemplateVariableOptions,
	TemplateVariableSuggestionItem,
	TemplateVariableSuggestionItems,
} from "@rangex/editor";
import type { Accessor } from "solid-js";
import type { ReactiveCaretMenuPort } from "../../_Utilities";

export interface TemplateVariableInsertParams {
	kind: TemplateVariableKind;
}

export interface ReactiveTemplateVariablePort {
	readonly caretMenu: ReactiveCaretMenuPort;

	canInsert: Accessor<boolean>;
	options: Accessor<TemplateVariableOptions>;
	filteredItems: Accessor<TemplateVariableSuggestionItems>;

	insert(params: TemplateVariableInsertParams): void;
	changeOptions(options: Partial<TemplateVariableOptions>): void;
	select(item: TemplateVariableSuggestionItem): void;
}
