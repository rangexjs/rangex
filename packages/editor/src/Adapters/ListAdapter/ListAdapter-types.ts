import type { BlockComponent, ListLocalName } from "rich-text-area";
import type {
	CreateAdapterParams,
	CurrentComponentConfigPort,
	CurrentComponentPublicPort,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export interface ListState {
	canInsert?: boolean;
	canWrap?: boolean;
	isActive?: boolean;
}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapUpdateCallbackFn = (canWrap: boolean) => void;
export type OnIsActiveUpdateCallbackFn = (isActive: boolean) => void;

export interface ListPlacementOption {
	localName: ListLocalName;
}

export interface OnInsertCallbackParams extends ListPlacementOption {}

export type OnInsertCallbackFn = (params: OnInsertCallbackParams) => void;

export interface OnWrapCallbackParams extends ListPlacementOption {}

export type OnWrapCallbackFn = (params: OnWrapCallbackParams) => void;

export interface UpdateStateParams extends ListState {}

export interface ListConfigPortProps {
	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
}

export interface ListConfigPort
	extends ListConfigPortProps,
		UnwrapConfigPort,
		CurrentComponentConfigPort<BlockComponent> {}

export interface InsertParams extends ListPlacementOption {}

export interface WrapParams extends ListPlacementOption {}

export interface ListPublicPortProps {
	readonly canInsert: boolean;
	readonly canWrap: boolean;
	readonly isActive: boolean;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapUpdateCallbackFn): () => void;
	onIsActiveUpdate(callback: OnIsActiveUpdateCallbackFn): () => void;

	insert(params: InsertParams): void;
	wrap(params: WrapParams): void;
}

export interface ListPublicPort
	extends ListPublicPortProps,
		UnwrapPublicPort,
		CurrentComponentPublicPort {}

export interface ListInternals {
	canInsert: boolean;
	canWrap: boolean;
	isActive: boolean;
}

export interface ListAdapter {
	configPort: ListConfigPort;
	publicPort: ListPublicPort;
}

export interface ListSettings {}

export interface CreateListAdapterParams
	extends CreateAdapterParams<ListSettings> {}

export interface CreateListAdapterResult extends ListAdapter {}
