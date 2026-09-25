import type {
	TemplateVariableOptions,
	TemplateVariableSuggestionItems,
} from "@rangex/editor";
import type { Accessor } from "solid-js";
import type { ReactiveCaretMenuPort } from "../_Utilities";

export interface ReactiveTemplateVariablePort {
	caretMenu: ReactiveCaretMenuPort;
	canInsert: Accessor<boolean>;
	options: Accessor<TemplateVariableOptions>;
	items: TemplateVariableSuggestionItems;
}
