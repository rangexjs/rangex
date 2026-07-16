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

export type AudioSwapCheckState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export type OnAudioSwapCheckStateChangeFn = (
	state: AudioSwapCheckState,
) => void;

export interface AudioSwapPopover {
	popover: HTMLDivElement;
	onSwap(callback: OnAudioSwapFn): () => void;
	updateCheckState(state: AudioSwapCheckState): void;
	onCheckStateChange(callback: OnAudioSwapCheckStateChangeFn): () => void;
}
