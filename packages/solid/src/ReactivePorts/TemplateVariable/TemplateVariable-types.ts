import type {
	TemplateVariableOptions,
	TemplateVariableSuggestionItems,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveTemplateVariablePort {
	canInsert: Accessor<boolean>;
	options: Accessor<TemplateVariableOptions>;
	filteredItems: Accessor<TemplateVariableSuggestionItems>;
}
