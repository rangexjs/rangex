export interface AudioEmitSwapURLParams {
	source: "url";
	url: string;
}

export interface AudioEmitSwapFileUploadParams {
	source: "file-upload";
	files: FileList;
}

export type AudioEmitSwapParams =
	| AudioEmitSwapURLParams
	| AudioEmitSwapFileUploadParams;

export type OnAudioSwapFn = (params: AudioEmitSwapParams) => void;

export interface AudioSwapPopover {
	popover: HTMLDivElement;
	onSwap(callback: OnAudioSwapFn): () => void;
}
