import type {
	TemplateVariableKind,
	TemplateVariableOptions,
	TemplateVariableSuggestionItem,
	TemplateVariableSuggestionItems,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface TemplateVariableInsertParams {
	kind: TemplateVariableKind;
}

export interface ReactiveTemplateVariablePort {
	readonly caretMenuEl: HTMLDivElement;

	canInsert: Accessor<boolean>;
	options: Accessor<TemplateVariableOptions>;
	filteredItems: Accessor<TemplateVariableSuggestionItems>;
	caretMenuOpen: Accessor<boolean>;

	insert(params: TemplateVariableInsertParams): void;
	changeOptions(options: Partial<TemplateVariableOptions>): void;
	select(item: TemplateVariableSuggestionItem): void;
}

export interface ReactiveTemplateVariableResult {
	port: ReactiveTemplateVariablePort;
	dispose: () => void;
}
