import type { CreateAdapterConstructor, MediaResolveParams } from "#ports";

export type EmptyMediaAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

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

export type UploadState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export interface EmptyMediaToolbarButtonState {
	disabled: boolean;
}

export interface EmptyMediaState {
	toolbarButton?: EmptyMediaToolbarButtonState;
}

export interface UpdateEmptyMediaStateParams extends EmptyMediaState {}

export type EmptyMediaUpdateToolbarButtonFn = (
	value: EmptyMediaToolbarButtonState,
) => void;

export type EmptyMediaOnInsertRequestFn = () => void;

export interface EmptyMediaElementState {
	uploadState: UploadState;
	uploadStateListeners: Set<EmptyMediaUpdateUploadStateFn>;
	dispose: () => void;
}

export type EmptyMediaUpdateUploadStateFn = (value: UploadState) => void;

export interface AttachEmptyMediaParams {
	element: HTMLElement;
}

export interface DetachEmptyMediaParams {
	element: HTMLElement;
}

export interface UpdateEmptyMediaElementStateParams {
	element: HTMLElement;
	uploadState?: UploadState;
}

export interface EmitResolveParams {
	element: HTMLElement;
	detail: MediaResolveDetail;
}

export type EmptyMediaOnResolveFn = (params: EmitResolveParams) => void;

export interface EmptyMediaUIPort {
	readonly toolbarButton: EmptyMediaToolbarButtonState;
	onToolbarButtonUpdate(callback: EmptyMediaUpdateToolbarButtonFn): () => void;
	getUploadState(element: HTMLElement): UploadState;
	onUploadStateUpdate(
		element: HTMLElement,
		callback: EmptyMediaUpdateUploadStateFn,
	): () => void;
	emitInsertRequest(): void;
	emitResolve(params: EmitResolveParams): void;
}

export interface EmptyMediaEditorPort {
	updateState(params: UpdateEmptyMediaStateParams): void;
	onInsertRequest(callback: EmptyMediaOnInsertRequestFn): () => void;
	attach(params: AttachEmptyMediaParams): void;
	detach(params: DetachEmptyMediaParams): void;
	updateElementState(params: UpdateEmptyMediaElementStateParams): void;
	onResolve(callback: EmptyMediaOnResolveFn): () => void;
	emitMediaResolve(params: MediaResolveParams): void;
}
