import type {
	CreateAdapterConstructor,
	RemovePort,
	UnwrapPort,
} from "../_Utilities";

export type ConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export interface AccordionItemState {
	canInsert?: boolean;
	canWrap?: boolean;
	isActive?: boolean;
}

export interface UpdateStateParams extends AccordionItemState {}

export type OnInsertCallbackFn = () => void;
export type OnWrapCallbackFn = () => void;

export interface AccordionItemConfigPort extends RemovePort, UnwrapPort {
	updateState(params: UpdateStateParams): void;
	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
}

export type OnCanInsertCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapCallbackFn = (canWrap: boolean) => void;
export type OnIsActiveCallbackFn = (isActive: boolean) => void;

export interface AccordionItemPublicPort {
	readonly canInsert: boolean;
	readonly canWrap: boolean;
	readonly isActive: boolean;

	onCanInsertUpdate(callback: OnCanInsertCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapCallbackFn): () => void;
	onIsActiveUpdate(callback: OnIsActiveCallbackFn): () => void;

	insert(): void;
	remove(): void;
	wrap(): void;
	unwrap(): void;
}
