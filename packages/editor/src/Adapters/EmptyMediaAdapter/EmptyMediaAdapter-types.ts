import type {
	CreateAdapterParams,
	MediaResolveDetail,
	MediaType,
} from "../_Utilities";

export interface ResolveOption {
	element: HTMLDivElement;
	detail: MediaResolveDetail;
}

export interface EmptyMediaState {
	canInsert?: boolean;
}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;

export type OnInsertCallbackFn = () => void;

export type OnSwapCallbackFn = () => void;

export type OnResolveCallbackFn = (params: ResolveOption) => void;

export type CreateSlottedElementFn = () => HTMLDivElement;

export type RemoveSlottedElementFn = (container: HTMLDivElement) => void;

export interface UpdateStateParams extends EmptyMediaState {}

export interface EmptyMediaConfigPortProps {
	updateState(params: UpdateStateParams): void;

	createSlottedElement: CreateSlottedElementFn;
	removeSlottedElement: RemoveSlottedElementFn;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onSwap(callback: OnSwapCallbackFn): () => void;
	onResolve(callback: OnResolveCallbackFn): () => void;

	emitMediaResolve(detail: MediaResolveDetail): void;
}

export interface EmptyMediaConfigPort extends EmptyMediaConfigPortProps {}

export type RegisterSlottedElementCallbackFn = (
	container: HTMLDivElement,
) => () => void;

export interface EmptyMediaPublicPortProps {
	readonly canInsert: boolean;
	readonly supportedMediaTypes: MediaType[];

	registerSlottedElement(callback: RegisterSlottedElementCallbackFn): void;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;

	insert(): void;
	resolve(params: ResolveOption): void;
}

export interface EmptyMediaPublicPort extends EmptyMediaPublicPortProps {}

export interface EmptyMediaInternals {
	registerSlottedElement: RegisterSlottedElementCallbackFn | null;
}

export interface EmptyMediaAdapter {
	configPort: EmptyMediaConfigPort;
	publicPort: EmptyMediaPublicPort;
}

export interface EmptyMediaSettings {}

export interface CreateEmptyMediaAdapterParams
	extends CreateAdapterParams<EmptyMediaSettings> {}

export interface CreateEmptyMediaAdapterResult extends EmptyMediaAdapter {}
