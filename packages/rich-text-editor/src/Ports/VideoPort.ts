import type { BlockAlignPort, BlockAlignValue } from "./_Shared/BlockAlignPort";
import type { CaptionPort, CaptionState } from "./_Shared/CaptionPort";
import type { DeletePort } from "./_Shared/DeletePort";

export type VideoObjectFitValue = "cover" | "contain" | "fill";
export type VideoAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";

export type VideoSwapCheckState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export interface VideoPopoverState {
	align?: BlockAlignValue;
	objectFit?: VideoObjectFitValue;
	aspectRatio?: VideoAspectRatioValue;
	caption?: CaptionState;
	poster?: string;
	title?: string;
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	swapCheckState?: VideoSwapCheckState;
}

export interface UpdateVideoPopoverStateParams extends VideoPopoverState {}

export interface VideoAttrChange {
	objectFit?: VideoObjectFitValue;
	aspectRatio?: VideoAspectRatioValue;
	title?: string;
	poster?: string;
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
}

export type OnVideoAttrChangeFn = (params: VideoAttrChange) => void;

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

export interface VideoPort extends BlockAlignPort, CaptionPort, DeletePort {
	popover: HTMLDivElement;
	swapPopover: HTMLDivElement;
	updateState(params: UpdateVideoPopoverStateParams): void;
	onVideoAttrChange(callback: OnVideoAttrChangeFn): () => void;
	onSwap(callback: OnVideoSwapFn): () => void;
}
