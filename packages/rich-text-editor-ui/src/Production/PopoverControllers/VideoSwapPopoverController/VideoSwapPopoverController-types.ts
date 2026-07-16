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

export type VideoSwapCheckState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export type OnVideoSwapCheckStateChangeFn = (
	state: VideoSwapCheckState,
) => void;

export interface VideoSwapPopover {
	popover: HTMLDivElement;
	onSwap(callback: OnVideoSwapFn): () => void;
	updateCheckState(state: VideoSwapCheckState): void;
	onCheckStateChange(callback: OnVideoSwapCheckStateChangeFn): () => void;
}
