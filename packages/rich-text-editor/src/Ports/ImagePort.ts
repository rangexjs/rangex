import type { BlockAlignPort, BlockAlignValue } from "./_Shared/BlockAlignPort";
import type { CaptionPort, CaptionState } from "./_Shared/CaptionPort";
import type { DeletePort } from "./_Shared/DeletePort";

export type ImageObjectFitValue = "cover" | "contain" | "fill";
export type ImageAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";

export type ImageSwapCheckState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export interface ImagePopoverState {
	align?: BlockAlignValue;
	objectFit?: ImageObjectFitValue;
	aspectRatio?: ImageAspectRatioValue;
	caption?: CaptionState;
	altText?: string;
	swapCheckState?: ImageSwapCheckState;
}

export interface UpdateImagePopoverStateParams extends ImagePopoverState {}

export interface ImageAttrChange {
	objectFit?: ImageObjectFitValue;
	aspectRatio?: ImageAspectRatioValue;
	altText?: string;
}

export type OnImageAttrChangeFn = (params: ImageAttrChange) => void;

export interface ImageEmitSwapURLParams {
	source: "url";
	url: string;
}

export interface ImageEmitSwapFileUploadParams {
	source: "file-upload";
	files: FileList;
}

export type ImageEmitSwapParams =
	| ImageEmitSwapURLParams
	| ImageEmitSwapFileUploadParams;

export type OnImageSwapFn = (params: ImageEmitSwapParams) => void;

export interface ImagePort extends BlockAlignPort, CaptionPort, DeletePort {
	popover: HTMLDivElement;
	swapPopover: HTMLDivElement;
	updateState(params: UpdateImagePopoverStateParams): void;
	onImageAttrChange(callback: OnImageAttrChangeFn): () => void;
	onSwap(callback: OnImageSwapFn): () => void;
}
