import type { CreateAdapterParams } from "../_Utilities";

export interface BlockQuoteState {
	canInsert?: boolean;
	canWrap?: boolean;
}

export interface UpdateStateParams extends BlockQuoteState {}

export type OnInsertCallbackFn = () => void;
export type OnWrapCallbackFn = () => void;

export interface BlockQuoteConfigPortProps {
	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
}

export interface BlockQuoteConfigPort extends BlockQuoteConfigPortProps {}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapUpdateCallbackFn = (canWrap: boolean) => void;

export interface BlockQuotePublicPortProps {
	readonly canInsert: boolean;
	readonly canWrap: boolean;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapUpdateCallbackFn): () => void;

	insert(): void;
	wrap(): void;
}

export interface BlockQuotePublicPort extends BlockQuotePublicPortProps {}

export interface BlockQuoteInternals {
	canInsert: boolean;
	canWrap: boolean;
}

export interface BlockQuoteAdapter {
	configPort: BlockQuoteConfigPort;
	publicPort: BlockQuotePublicPort;
}

export interface BlockQuoteSettings {}

export interface CreateBlockQuoteAdapterParams
	extends CreateAdapterParams<BlockQuoteSettings> {}

export interface CreateBlockQuoteAdapterResult extends BlockQuoteAdapter {}
