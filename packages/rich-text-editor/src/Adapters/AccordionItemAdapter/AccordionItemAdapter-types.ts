import type { CreateAdapterConstructor } from "#ports";

export type AccordionItemAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export interface AccordionItemToolbarButtonState {
	disabled: boolean;
}

export interface AccordionItemState {
	toolbarButton?: AccordionItemToolbarButtonState;
}

export interface UpdateAccordionItemStateParams extends AccordionItemState {}

export type AccordionItemUpdateToolbarButtonFn = (
	value: AccordionItemToolbarButtonState,
) => void;

export interface AccordionItemUIPort {
	readonly toolbarButton: AccordionItemToolbarButtonState;
	onToolbarButtonUpdate(
		callback: AccordionItemUpdateToolbarButtonFn,
	): () => void;
	emitInsertRequest(): void;
}

export type AccordionItemOnInsertRequestFn = () => void;

export interface AccordionItemEditorPort {
	updateState(params: UpdateAccordionItemStateParams): void;
	onInsertRequest(callback: AccordionItemOnInsertRequestFn): () => void;
}
