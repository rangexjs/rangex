import type { CreateAdapterConstructor } from "#ports";
import type { EditorOverlayMount, UIOverlayMount } from "../_Utilities";

export type TemplateVariableAdapterConstructorParams =
	CreateAdapterConstructor<{
		[index: string]: never;
	}>;

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

export interface TemplateVariableOptions {
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	date: string | null;
}

export interface TemplateVariableToolbarButtonState {
	disabled: boolean;
	options: TemplateVariableOptions;
}

export interface TemplateVariableState {
	toolbarButton?: TemplateVariableToolbarButtonState;
	query?: string;
	isOpen?: boolean;
}

export interface UpdateTemplateVariableStateParams
	extends TemplateVariableState {}

export interface TemplateVariableInsertRequestParams {
	kind: TemplateVariableKind;
}

export interface TemplateVariableUpdateRequestParams {
	options: Partial<TemplateVariableOptions>;
}

export type TemplateVariableUpdateToolbarButtonFn = (
	value: TemplateVariableToolbarButtonState,
) => void;
export type TemplateVariableUpdateFilteredItemsFn = (
	value: TemplateVariablePopoverItems,
) => void;
export type TemplateVariableUpdateIsOpenFn = (value: boolean) => void;

export interface TemplateVariableUIPort {
	readonly anchoredOverlay: UIOverlayMount;
	readonly toolbarButton: TemplateVariableToolbarButtonState;
	readonly filteredItems: TemplateVariablePopoverItems;
	onToolbarButtonUpdate(
		callback: TemplateVariableUpdateToolbarButtonFn,
	): () => void;
	onFilteredItemsUpdate(
		callback: TemplateVariableUpdateFilteredItemsFn,
	): () => void;
	readonly isOpen: boolean;
	onIsOpenUpdate(callback: TemplateVariableUpdateIsOpenFn): () => void;
	emitInsertRequest(params: TemplateVariableInsertRequestParams): void;
	emitUpdateRequest(params: TemplateVariableUpdateRequestParams): void;
	emitSelect(item: TemplateVariablePopoverItem): void;
}

export type TemplateVariableOnInsertRequestFn = (
	params: TemplateVariableInsertRequestParams,
) => void;
export type TemplateVariableOnUpdateRequestFn = (
	params: TemplateVariableUpdateRequestParams,
) => void;
export type TemplateVariableOnSelectFn = (
	item: TemplateVariablePopoverItem,
) => void;

export interface TemplateVariableEditorPort {
	readonly anchoredOverlay: EditorOverlayMount;
	readonly toolbarButton: TemplateVariableToolbarButtonState;
	readonly filteredItems: TemplateVariablePopoverItems;
	updateState(params: UpdateTemplateVariableStateParams): void;
	onInsertRequest(callback: TemplateVariableOnInsertRequestFn): () => void;
	onUpdateRequest(callback: TemplateVariableOnUpdateRequestFn): () => void;
	onSelect(callback: TemplateVariableOnSelectFn): () => void;
}
