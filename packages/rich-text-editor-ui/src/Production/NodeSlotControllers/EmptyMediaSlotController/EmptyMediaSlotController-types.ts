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

export type MediaResolveType = MediaResolveDetail["type"];

export type UploadState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export interface MountParams {
	container: HTMLElement;
}

export interface MountResult {
	dispose: () => void;
	update: (uploadState: UploadState) => void;
}

export interface UpdateParams {
	container: HTMLElement;
	uploadState: UploadState;
}

export interface DisposeParams {
	container: HTMLElement;
}

export interface OnResolveParams {
	container: HTMLElement;
	detail: MediaResolveDetail;
}

export type OnResolveFn = (params: OnResolveParams) => void;

export interface EmptyMediaSlotPublicAPI {
	mount: (params: MountParams) => void;
	update: (params: UpdateParams) => void;
	dispose: (params: DisposeParams) => void;
	onResolve: (callback: OnResolveFn) => () => void;
}
