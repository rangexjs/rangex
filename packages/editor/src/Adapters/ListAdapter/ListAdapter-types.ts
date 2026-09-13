import type { ListLocalName } from "rich-text-area";
import type { CreateAdapterParams } from "../_Utilities";

export interface ListState {
	canInsert?: boolean;
	canWrap?: boolean;
}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapUpdateCallbackFn = (canWrap: boolean) => void;

export interface PlacementOption {
	localName: ListLocalName;
}

export interface OnInsertCallbackParams extends PlacementOption {}

export type OnInsertCallbackFn = (params: OnInsertCallbackParams) => void;

export interface OnWrapCallbackParams extends PlacementOption {}

export type OnWrapCallbackFn = (params: OnWrapCallbackParams) => void;

export interface UpdateStateParams extends ListState {}

export interface ListConfigPortProps {
	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
}

export interface ListConfigPort extends ListConfigPortProps {}

export interface InsertParams extends PlacementOption {}

export interface WrapParams extends PlacementOption {}

export interface ListPublicPortProps {
	readonly canInsert: boolean;
	readonly canWrap: boolean;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapUpdateCallbackFn): () => void;

	insert(params: InsertParams): void;
	wrap(params: WrapParams): void;
}

export interface ListPublicPort extends ListPublicPortProps {}

export interface ListInternals {
	canInsert: boolean;
	canWrap: boolean;
}

export interface ListAdapter {
	configPort: ListConfigPort;
	publicPort: ListPublicPort;
}

export interface ListSettings {}

export interface CreateListAdapterParams
	extends CreateAdapterParams<ListSettings> {}

export interface CreateListAdapterResult extends ListAdapter {}
