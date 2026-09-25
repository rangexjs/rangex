import type {
	CaretMenuQuery,
	TemplateVariableOptions,
	TemplateVariableSuggestionItems,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveTemplateVariablePort {
	canInsert: Accessor<boolean>;
	options: Accessor<TemplateVariableOptions>;
	query: Accessor<CaretMenuQuery>;
	items: TemplateVariableSuggestionItems;
}
