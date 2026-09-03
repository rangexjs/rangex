import type {
	CreateAdapterParams,
	RemoveConfigPort,
	RemovePublicPort,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export interface AccordionItemState {
	canInsert?: boolean;
	canWrap?: boolean;
	isActive?: boolean;
}

export interface UpdateStateParams extends AccordionItemState {}

export type OnInsertCallbackFn = () => void;
export type OnWrapCallbackFn = () => void;

export interface AccordionItemConfigPortProps {
	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
}

export interface AccordionItemConfigPort
	extends AccordionItemConfigPortProps,
		RemoveConfigPort,
		UnwrapConfigPort {}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapUpdateCallbackFn = (canWrap: boolean) => void;
export type OnIsActiveUpdateCallbackFn = (isActive: boolean) => void;

export interface AccordionItemPublicPortProps {
	readonly canInsert: boolean;
	readonly canWrap: boolean;
	readonly isActive: boolean;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapUpdateCallbackFn): () => void;
	onIsActiveUpdate(callback: OnIsActiveUpdateCallbackFn): () => void;

	insert(): void;
	wrap(): void;
}

export interface AccordionItemPublicPort
	extends AccordionItemPublicPortProps,
		RemovePublicPort,
		UnwrapPublicPort {}

export interface AccordionItemInternals {
	canInsert: boolean;
	canWrap: boolean;
	isActive: boolean;
}

export interface AccordionItemAdapter {
	configPort: AccordionItemConfigPort;
	publicPort: AccordionItemPublicPort;
}

export interface AccordionItemSettings {}

export interface CreateAccordionItemAdapterParams
	extends CreateAdapterParams<AccordionItemSettings> {}

export interface CreateAccordionItemAdapterResult
	extends AccordionItemAdapter {}
