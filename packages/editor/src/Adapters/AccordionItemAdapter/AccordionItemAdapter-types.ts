import type {
	CreateAdapterConstructor,
	DeletePort,
	UnwrapPort,
} from "../_Utilities";

export type AccordionItemAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export interface AccordionItemState {
	canInsert?: boolean;
	canWrap?: boolean;
	isActive?: boolean;
}

export interface UpdateAccordionItemStateParams extends AccordionItemState {}

export type AccordionItemOnInsertCallbackFn = () => void;
export type AccordionItemOnWrapCallbackFn = () => void;

export interface AccordionItemConfigPort extends DeletePort, UnwrapPort {
	updateState(params: UpdateAccordionItemStateParams): void;
	onInsert(callback: AccordionItemOnInsertCallbackFn): () => void;
	onWrap(callback: AccordionItemOnWrapCallbackFn): () => void;
}

export type AccordionItemOnCanInsertCallbackFn = (canInsert: boolean) => void;
export type AccordionItemOnCanWrapCallbackFn = (canWrap: boolean) => void;
export type AccordionItemOnIsActiveCallbackFn = (isActive: boolean) => void;

export interface AccordionItemPublicPort {
	readonly canInsert: boolean;
	readonly canWrap: boolean;
	readonly isActive: boolean;

	onCanInsertUpdate(callback: AccordionItemOnCanInsertCallbackFn): () => void;
	onCanWrapUpdate(callback: AccordionItemOnCanWrapCallbackFn): () => void;
	onIsActiveUpdate(callback: AccordionItemOnIsActiveCallbackFn): () => void;

	insert(): void;
	delete(): void;
	wrap(): void;
	unwrap(): void;
}
