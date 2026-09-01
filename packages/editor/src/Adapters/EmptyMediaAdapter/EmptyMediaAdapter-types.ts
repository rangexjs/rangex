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
export type CreateSlottedElementFn = () => HTMLElement;

export type DisposeSlottedElementFn = (element: HTMLElement) => void;

export interface Settings {
	uploadFile: UploadMediaFileFn;
	createSlottedElement: CreateSlottedElementFn;
	disposeSlottedElement: DisposeSlottedElementFn;
}

export type ConstructorParams = CreateAdapterConstructor<Settings>;

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
	element: HTMLElement;
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
	element: HTMLElement;
	uploadState?: UploadState;
}

export type OnInsertCallbackFn = () => void;

export type OnResolveCallbackFn = (params: ResolveOption) => void;

export interface EmptyMediaConfigPort {
	readonly uploadFile: UploadMediaFileFn;
	createSlottedElement: CreateSlottedElementFn;
	disposeSlottedElement: DisposeSlottedElementFn;

	updateState(params: UpdateStateParams): void;
	updateElementState(params: UpdateElementStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onResolve(callback: OnResolveCallbackFn): () => void;

	emitMediaResolve(params: MediaResolveCallbackParams): void;
}

export type OnCanInsertCallbackFn = (canInsert: boolean) => void;

export interface EmptyMediaPublicPort {
	readonly canInsert: boolean;
	readonly supportedMediaTypes: MediaType[];

	onCanInsertUpdate(callback: OnCanInsertCallbackFn): () => void;
	getUploadState(element: HTMLElement): UploadState;
	onUploadStateUpdate(
		element: HTMLElement,
		callback: UpdateUploadStateCallbackFn,
	): () => void;

	insert(): void;
	resolve(params: ResolveOption): void;
}
