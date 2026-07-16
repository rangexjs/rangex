export interface VideoEmitSwapURLParams {
	source: "url";
	url: string;
}

export interface VideoEmitSwapFileUploadParams {
	source: "file-upload";
	files: FileList;
}

export type VideoEmitSwapParams =
	| VideoEmitSwapURLParams
	| VideoEmitSwapFileUploadParams;

export type OnVideoSwapFn = (params: VideoEmitSwapParams) => void;

export interface VideoSwapPopover {
	popover: HTMLDivElement;
	onSwap(callback: OnVideoSwapFn): () => void;
}
