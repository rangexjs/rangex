import type {
	AudioAttrs,
	EmbedAttrs,
	ImageAttrs,
	VideoAttrs,
} from "#dom-attrs";
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

/*
 * A component's attributes, with its media element's src that can also be a File: it's uploaded (see uploadFile), and
 * replaced by the uploaded file's URL
 */
export type WithFileSrc<
	TAttrs extends Record<string, object>,
	TMediaElementName extends keyof TAttrs,
> = Omit<TAttrs, TMediaElementName> & {
	[ElementName in TMediaElementName]: Omit<TAttrs[ElementName], "src"> & {
		src: string | File;
	};
};

/*
 * The media to insert, with every attribute of its component
 */
export type MediaResolveDetail =
	| { type: "image"; attrs: WithFileSrc<ImageAttrs, "img"> }
	| { type: "video"; attrs: WithFileSrc<VideoAttrs, "video"> }
	| { type: "audio"; attrs: WithFileSrc<AudioAttrs, "audio"> }
	| { type: "embed"; attrs: EmbedAttrs };

export interface ResolveOption {
	element: HTMLDivElement;
	detail: MediaResolveDetail;
}

export type UploadStatus =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export type OnUploadStatusUpdateCallbackFn = (value: UploadStatus) => void;

export interface UpdateElementStateParams {
	element: HTMLDivElement;
	uploadStatus?: UploadStatus;
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
	getUploadStatus(element: HTMLDivElement): UploadStatus;
	onUploadStatusUpdate(
		element: HTMLDivElement,
		callback: OnUploadStatusUpdateCallbackFn,
	): () => void;

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

export interface EmptyMediaSettings {
	uploadFile: UploadMediaFileFn;
}

export interface CreateEmptyMediaAdapterParams
	extends CreateAdapterParams<EmptyMediaSettings> {}

export interface CreateEmptyMediaAdapterResult extends EmptyMediaAdapter {}
