import type { BlockComponent } from "@rangex/core";
import type {
	CreateAdapterParams,
	CurrentComponentConfigPort,
	CurrentComponentPublicPort,
	RemoveConfigPort,
	RemovePublicPort,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export interface AccordionItemState {
	canInsert?: boolean;
	canWrap?: boolean;
}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapUpdateCallbackFn = (canWrap: boolean) => void;

export type OnInsertCallbackFn = () => void;
export type OnWrapCallbackFn = () => void;

export interface UpdateStateParams extends AccordionItemState {}

export interface AccordionItemConfigPortProps {
	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
}

export interface AccordionItemConfigPort
	extends AccordionItemConfigPortProps,
		RemoveConfigPort,
		UnwrapConfigPort,
		CurrentComponentConfigPort<BlockComponent> {}

export interface AccordionItemPublicPortProps {
	readonly canInsert: boolean;
	readonly canWrap: boolean;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapUpdateCallbackFn): () => void;

	insert(): void;
	wrap(): void;
}

export interface AccordionItemPublicPort
	extends AccordionItemPublicPortProps,
		RemovePublicPort,
		UnwrapPublicPort,
		CurrentComponentPublicPort {}

export interface AccordionItemAdapter {
	configPort: AccordionItemConfigPort;
	publicPort: AccordionItemPublicPort;
}

export interface AccordionItemSettings {}

export interface CreateAccordionItemAdapterParams
	extends CreateAdapterParams<AccordionItemSettings> {}

export interface CreateAccordionItemAdapterResult
	extends AccordionItemAdapter {}
