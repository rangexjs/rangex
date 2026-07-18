import type { TemplateVariablePopoverItems } from "#ports";

export type TemplateVariablePopoverUpdateFilteredItemsFn = (
	value: TemplateVariablePopoverItems,
) => void;

export type TemplateVariablePopoverListenerOption = {
	type: "filteredItems";
	callback: TemplateVariablePopoverUpdateFilteredItemsFn;
};

export type TemplateVariablePopoverUpdateListenerParams =
	TemplateVariablePopoverListenerOption & {
		operation: "add" | "delete";
	};
