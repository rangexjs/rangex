import type { BlockComponent } from "@rangex/core";
import type {
	AccordionItemAttrs,
	AccordionItemAttrsShape,
	AccordionItemAttrValidators,
} from "#dom-attrs";
import type {
	CreateAdapterParams,
	CurrentComponentConfigPort,
	CurrentComponentPublicPort,
	DOMAttrsConfigPort,
	DOMAttrsPublicPort,
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

export interface AccordionItemPlacementOption {
	attrs: AccordionItemAttrs;
}

export interface InsertParams extends AccordionItemPlacementOption {}

export interface WrapParams extends AccordionItemPlacementOption {}

export type OnInsertCallbackFn = (params: InsertParams) => void;
export type OnWrapCallbackFn = (params: WrapParams) => void;

export interface UpdateStateParams extends AccordionItemState {}

export interface AccordionItemConfigPortProps {
	readonly attrValidators: AccordionItemAttrValidators;

	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
}

export interface AccordionItemConfigPort
	extends AccordionItemConfigPortProps,
		RemoveConfigPort,
		UnwrapConfigPort,
		CurrentComponentConfigPort<BlockComponent>,
		DOMAttrsConfigPort<AccordionItemAttrsShape> {}

export interface AccordionItemPublicPortProps {
	readonly canInsert: boolean;
	readonly canWrap: boolean;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapUpdateCallbackFn): () => void;

	insert(params: InsertParams): void;
	wrap(params: WrapParams): void;
}

export interface AccordionItemPublicPort
	extends AccordionItemPublicPortProps,
		RemovePublicPort,
		UnwrapPublicPort,
		CurrentComponentPublicPort,
		DOMAttrsPublicPort<AccordionItemAttrsShape> {}

export interface AccordionItemAdapter {
	configPort: AccordionItemConfigPort;
	publicPort: AccordionItemPublicPort;
}

export interface AccordionItemSettings {}

export interface CreateAccordionItemAdapterParams
	extends CreateAdapterParams<AccordionItemSettings> {}

export interface CreateAccordionItemAdapterResult
	extends AccordionItemAdapter {}
