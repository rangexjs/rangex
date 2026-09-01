import type {
	CreateAdapterConstructor,
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

// TODO: Editor should be passed as a param
export type EmptyMediaCreateSlottedElementFn = () => HTMLElement;

export type EmptyMediaDisposeSlottedElementFn = (element: HTMLElement) => void;

export interface EmptyMediaSettings {
	uploadFile: UploadMediaFileFn;
	createSlottedElement: EmptyMediaCreateSlottedElementFn;
	disposeSlottedElement: EmptyMediaDisposeSlottedElementFn;
}

export type EmptyMediaAdapterConstructorParams =
	CreateAdapterConstructor<EmptyMediaSettings>;

export interface EmptyMediaState {
	canInsert?: boolean;
}

export interface EmptyMediaUpdateStateParams extends EmptyMediaState {}

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

export interface EmptyMediaResolveOption {
	element: HTMLElement;
	detail: MediaResolveDetail;
}

export type EmptyMediaUploadState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export type EmptyMediaUpdateUploadStateCallbackFn = (
	value: EmptyMediaUploadState,
) => void;

export interface EmptyMediaElementState {
	uploadState: EmptyMediaUploadState;
	uploadStateListeners: Set<EmptyMediaUpdateUploadStateCallbackFn>;
}

export interface EmptyMediaUpdateElementStateParams {
	element: HTMLElement;
	uploadState?: EmptyMediaUploadState;
}

export type EmptyMediaOnInsertCallbackFn = () => void;

export type EmptyMediaOnResolveCallbackFn = (
	params: EmptyMediaResolveOption,
) => void;

export interface EmptyMediaConfigPort {
	readonly uploadFile: UploadMediaFileFn;
	createSlottedElement: EmptyMediaCreateSlottedElementFn;
	disposeSlottedElement: EmptyMediaDisposeSlottedElementFn;

	updateState(params: EmptyMediaUpdateStateParams): void;
	updateElementState(params: EmptyMediaUpdateElementStateParams): void;

	onInsert(callback: EmptyMediaOnInsertCallbackFn): () => void;
	onResolve(callback: EmptyMediaOnResolveCallbackFn): () => void;

	emitMediaResolve(params: MediaResolveCallbackParams): void;
}

export type EmptyMediaOnCanInsertCallbackFn = (canInsert: boolean) => void;

export interface EmptyMediaPublicPort {
	readonly canInsert: boolean;
	readonly supportedMediaTypes: MediaType[];

	onCanInsertUpdate(callback: EmptyMediaOnCanInsertCallbackFn): () => void;
	getUploadState(element: HTMLElement): EmptyMediaUploadState;
	onUploadStateUpdate(
		element: HTMLElement,
		callback: EmptyMediaUpdateUploadStateCallbackFn,
	): () => void;

	insert(): void;
	resolve(params: EmptyMediaResolveOption): void;
}
