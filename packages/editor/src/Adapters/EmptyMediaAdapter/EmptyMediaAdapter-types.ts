import type {
	CreateAdapterParams,
	MediaResolveCallbackParams,
	MediaType,
} from "../_Utilities";

export interface UploadMediaFileParams {
	file: File;
	onProgress?: (progress: number) => void;
}

export type UploadMediaFileFn = (
	params: UploadMediaFileParams,
) => Promise<string | null>;

export interface EmptyMediaState {
	canInsert?: boolean;
}

export interface UpdateStateParams extends EmptyMediaState {}

export interface MediaFile {
	insertionType: "file";
	file: File;
}

export interface MediaURL {
	insertionType: "url";
	url: string;
}

export type MediaSource = MediaFile | MediaURL;

export type MediaResolveDetail =
	| ({ type: "image" | "video" | "audio" } & MediaSource)
	| ({ type: "embed" } & MediaURL);

export interface ResolveOption {
	element: HTMLDivElement;
	detail: MediaResolveDetail;
}

export type UploadState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export type UpdateUploadStateCallbackFn = (value: UploadState) => void;

export interface ElementState {
	uploadState: UploadState;
	uploadStateListeners: Set<UpdateUploadStateCallbackFn>;
}

export interface UpdateElementStateParams {
	element: HTMLDivElement;
	uploadState?: UploadState;
}

export type CreateSlottedElementFn = () => HTMLDivElement;

export type RemoveSlottedElementFn = (container: HTMLDivElement) => void;

export type OnInsertCallbackFn = () => void;

export type OnSwapCallbackFn = () => void;

export type OnResolveCallbackFn = (params: ResolveOption) => void;

export interface EmptyMediaConfigPortProps {
	readonly uploadFile: UploadMediaFileFn;

	updateState(params: UpdateStateParams): void;
	updateElementState(params: UpdateElementStateParams): void;

	createSlottedElement: CreateSlottedElementFn;
	removeSlottedElement: RemoveSlottedElementFn;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onSwap(callback: OnSwapCallbackFn): () => void;
	onResolve(callback: OnResolveCallbackFn): () => void;

	emitMediaResolve(params: MediaResolveCallbackParams): void;
}

export interface EmptyMediaConfigPort extends EmptyMediaConfigPortProps {}

export type RegisterSlottedElementCallbackFn = (
	container: HTMLDivElement,
) => () => void;

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;

export interface EmptyMediaPublicPortProps {
	readonly canInsert: boolean;
	readonly supportedMediaTypes: MediaType[];

	registerSlottedElement(callback: RegisterSlottedElementCallbackFn): void;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	getUploadState(element: HTMLDivElement): UploadState;
	onUploadStateUpdate(
		element: HTMLDivElement,
		callback: UpdateUploadStateCallbackFn,
	): () => void;

	insert(): void;
	resolve(params: ResolveOption): void;
}

export interface EmptyMediaPublicPort extends EmptyMediaPublicPortProps {}

export interface EmptyMediaInternals {
	canInsert: boolean;

	registerSlottedElement: RegisterSlottedElementCallbackFn | null;
}

export interface EmptyMediaAdapter {
	configPort: EmptyMediaConfigPort;
	publicPort: EmptyMediaPublicPort;
}

export interface EmptyMediaSettings {
	uploadFile: UploadMediaFileFn;
}

export interface CreateEmptyMediaAdapterParams
	extends CreateAdapterParams<EmptyMediaSettings> {}

export interface CreateEmptyMediaAdapterResult extends EmptyMediaAdapter {}
