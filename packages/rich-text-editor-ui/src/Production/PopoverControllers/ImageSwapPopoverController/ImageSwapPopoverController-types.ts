export interface EmitSwapURLParams {
	source: "url";
	url: string;
}

export interface EmitSwapFileUploadParams {
	source: "file-upload";
	files: FileList;
}

export type EmitSwapParams = EmitSwapURLParams | EmitSwapFileUploadParams;

export type OnSwapFn = (params: EmitSwapParams) => void;

export interface ImageSwapPopover {
	popover: HTMLDivElement;
	onSwap(callback: OnSwapFn): () => void;
}
