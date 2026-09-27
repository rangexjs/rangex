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
	localName?: ListLocalName | null;
}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapUpdateCallbackFn = (canWrap: boolean) => void;
export type OnLocalNameUpdateCallbackFn = (
	localName: ListLocalName | null,
) => void;

export interface ListPlacementOption {
	localName: ListLocalName;
}

export interface OnInsertCallbackParams extends ListPlacementOption {}

export type OnInsertCallbackFn = (params: OnInsertCallbackParams) => void;

export interface OnWrapCallbackParams extends ListPlacementOption {}

export type OnWrapCallbackFn = (params: OnWrapCallbackParams) => void;

export type OnChangeLocalNameCallbackFn = (localName: ListLocalName) => void;

export interface UpdateStateParams extends ListState {}

export interface ListConfigPortProps {
	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
	onChangeLocalName(callback: OnChangeLocalNameCallbackFn): () => void;
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
	readonly localName: ListLocalName | null;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapUpdateCallbackFn): () => void;
	onLocalNameUpdate(callback: OnLocalNameUpdateCallbackFn): () => void;

	insert(params: InsertParams): void;
	wrap(params: WrapParams): void;
	changeLocalName(localName: ListLocalName): void;
}

export interface ListPublicPort
	extends ListPublicPortProps,
		UnwrapPublicPort,
		CurrentComponentPublicPort {}

export interface ListInternals {
	canInsert: boolean;
	canWrap: boolean;
	localName: ListLocalName | null;
}

export interface ListAdapter {
	configPort: ListConfigPort;
	publicPort: ListPublicPort;
}

export interface ListSettings {}

export interface CreateListAdapterParams
	extends CreateAdapterParams<ListSettings> {}

export interface CreateListAdapterResult extends ListAdapter {}
