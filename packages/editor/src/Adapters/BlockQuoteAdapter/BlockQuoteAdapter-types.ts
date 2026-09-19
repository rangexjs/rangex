import type {
	CreateAdapterParams,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export interface BlockQuoteState {
	canInsert?: boolean;
	canWrap?: boolean;
	isActive?: boolean;
}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapUpdateCallbackFn = (canWrap: boolean) => void;
export type OnIsActiveUpdateCallbackFn = (isActive: boolean) => void;

export type OnInsertCallbackFn = () => void;
export type OnWrapCallbackFn = () => void;

export interface UpdateStateParams extends BlockQuoteState {}

export interface BlockQuoteConfigPortProps {
	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
}

export interface BlockQuoteConfigPort
	extends BlockQuoteConfigPortProps,
		UnwrapConfigPort {}

export interface BlockQuotePublicPortProps {
	readonly canInsert: boolean;
	readonly canWrap: boolean;
	readonly isActive: boolean;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapUpdateCallbackFn): () => void;
	onIsActiveUpdate(callback: OnIsActiveUpdateCallbackFn): () => void;

	insert(): void;
	wrap(): void;
}

export interface BlockQuotePublicPort
	extends BlockQuotePublicPortProps,
		UnwrapPublicPort {}

export interface BlockQuoteInternals {
	canInsert: boolean;
	canWrap: boolean;
	isActive: boolean;
}

export interface BlockQuoteAdapter {
	configPort: BlockQuoteConfigPort;
	publicPort: BlockQuotePublicPort;
}

export interface BlockQuoteSettings {}

export interface CreateBlockQuoteAdapterParams
	extends CreateAdapterParams<BlockQuoteSettings> {}

export interface CreateBlockQuoteAdapterResult extends BlockQuoteAdapter {}
