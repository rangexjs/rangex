export type TemplateVariableKind =
	| "full-name"
	| "first-name"
	| "last-name"
	| "email"
	| "date";

export interface TemplateVariablePopoverItem {
	kind: TemplateVariableKind;
	label: string;
}

export type TemplateVariablePopoverItems = TemplateVariablePopoverItem[];

export interface TemplateVariablePopoverState {
	query?: string;
}

export interface UpdateTemplateVariablePopoverStateParams
	extends TemplateVariablePopoverState {}

export type TemplateVariablePopoverOnSelectFn = (
	item: TemplateVariablePopoverItem,
) => void;

export interface TemplateVariablePort {
	popover: HTMLDivElement;
	filteredItems: TemplateVariablePopoverItems;
	updateState(params: UpdateTemplateVariablePopoverStateParams): void;
	onSelect(callback: TemplateVariablePopoverOnSelectFn): () => void;
}
