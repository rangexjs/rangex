import type {
	CreateAdapterParams,
	MediaResolveDetail,
	MediaType,
} from "../_Utilities";

export interface ResolveOption {
	element: HTMLDivElement;
	detail: MediaResolveDetail;
}

export interface SourcePlaceholderState {
	canInsert?: boolean;
}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;

export type OnInsertCallbackFn = () => void;

export type OnSwapCallbackFn = () => void;

export type OnResolveCallbackFn = (params: ResolveOption) => void;

export type CreateSlottedElementFn = () => HTMLDivElement;

export type RemoveSlottedElementFn = (container: HTMLDivElement) => void;

export interface UpdateStateParams extends SourcePlaceholderState {}

export interface SourcePlaceholderConfigPortProps {
	updateState(params: UpdateStateParams): void;

	createSlottedElement: CreateSlottedElementFn;
	removeSlottedElement: RemoveSlottedElementFn;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onSwap(callback: OnSwapCallbackFn): () => void;
	onResolve(callback: OnResolveCallbackFn): () => void;

	emitMediaResolve(detail: MediaResolveDetail): void;
}

export interface SourcePlaceholderConfigPort
	extends SourcePlaceholderConfigPortProps {}

export type RegisterSlottedElementCallbackFn = (
	container: HTMLDivElement,
) => () => void;

export interface SourcePlaceholderPublicPortProps {
	readonly canInsert: boolean;
	readonly supportedMediaTypes: MediaType[];

	registerSlottedElement(callback: RegisterSlottedElementCallbackFn): void;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;

	insert(): void;
	resolve(params: ResolveOption): void;
}

export interface SourcePlaceholderPublicPort
	extends SourcePlaceholderPublicPortProps {}

export interface SourcePlaceholderInternals {
	registerSlottedElement: RegisterSlottedElementCallbackFn | null;
}

export interface SourcePlaceholderAdapter {
	configPort: SourcePlaceholderConfigPort;
	publicPort: SourcePlaceholderPublicPort;
}

export interface SourcePlaceholderSettings {}

export interface CreateSourcePlaceholderAdapterParams
	extends CreateAdapterParams<SourcePlaceholderSettings> {}

export interface CreateSourcePlaceholderAdapterResult
	extends SourcePlaceholderAdapter {}
