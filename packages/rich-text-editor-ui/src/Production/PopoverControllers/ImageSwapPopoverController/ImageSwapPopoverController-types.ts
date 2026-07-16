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

export type SwapCheckState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export type OnSwapCheckStateChangeFn = (state: SwapCheckState) => void;

export interface ImageSwapPopover {
	popover: HTMLDivElement;
	onSwap(callback: OnSwapFn): () => void;
	updateCheckState(state: SwapCheckState): void;
	onCheckStateChange(callback: OnSwapCheckStateChangeFn): () => void;
}
