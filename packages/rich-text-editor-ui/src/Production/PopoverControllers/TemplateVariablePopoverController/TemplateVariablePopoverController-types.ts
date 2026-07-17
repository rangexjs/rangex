import type { TemplateVariableKind } from "../../ToolbarButtonProps";

export interface TemplateVariablePopoverItem {
	kind: TemplateVariableKind;
	label: string;
}

export type TemplateVariablePopoverItems = TemplateVariablePopoverItem[];

export type TemplateVariablePopoverUpdateFilteredItemsFn = (
	value: TemplateVariablePopoverItems,
) => void;

export interface TemplateVariablePopoverState {
	query?: string;
}

export interface UpdateTemplateVariablePopoverStateParams
	extends TemplateVariablePopoverState {}

export type TemplateVariablePopoverListenerOption = {
	type: "filteredItems";
	callback: TemplateVariablePopoverUpdateFilteredItemsFn;
};

export type TemplateVariablePopoverUpdateListenerParams =
	TemplateVariablePopoverListenerOption & {
		operation: "add" | "delete";
	};

export type TemplateVariablePopoverOnSelectFn = (
	item: TemplateVariablePopoverItem,
) => void;

export interface TemplateVariablePopover {
	popover: HTMLDivElement;
	filteredItems: TemplateVariablePopoverItems;
	updateState(params: UpdateTemplateVariablePopoverStateParams): void;
	onSelect(callback: TemplateVariablePopoverOnSelectFn): () => void;
}
