export type VideoBlockAlignValue = "left" | "center" | "right";
export type OnVideoAlignChangeFn = (align: VideoBlockAlignValue) => void;
export type UpdateVideoAlignFn = (value: VideoBlockAlignValue) => void;
export type OnVideoDeleteFn = () => void;

export type VideoObjectFitValue = "cover" | "contain" | "fill";
export type VideoAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";
export type VideoCaptionPosition = "above" | "below";

export interface VideoCaptionState {
	enabled: boolean;
	position: VideoCaptionPosition;
}

export type VideoSwapCheckState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export interface VideoPopoverState {
	align?: VideoBlockAlignValue;
	objectFit?: VideoObjectFitValue;
	aspectRatio?: VideoAspectRatioValue;
	caption?: VideoCaptionState;
	poster?: string;
	title?: string;
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	swapCheckState?: VideoSwapCheckState;
}

export interface UpdateVideoPopoverStateParams extends VideoPopoverState {}

export type UpdateVideoObjectFitFn = (value: VideoObjectFitValue) => void;
export type UpdateVideoAspectRatioFn = (value: VideoAspectRatioValue) => void;
export type UpdateVideoCaptionFn = (value: VideoCaptionState) => void;
export type UpdatePosterFn = (value: string) => void;
export type UpdateTitleFn = (value: string) => void;
export type UpdateControlsFn = (value: boolean) => void;
export type UpdateAutoplayFn = (value: boolean) => void;
export type UpdateLoopFn = (value: boolean) => void;
export type UpdateMutedFn = (value: boolean) => void;
export type UpdateVideoSwapCheckStateFn = (value: VideoSwapCheckState) => void;

export type VideoEditListenerOption =
	| { type: "align"; callback: UpdateVideoAlignFn }
	| { type: "objectFit"; callback: UpdateVideoObjectFitFn }
	| { type: "aspectRatio"; callback: UpdateVideoAspectRatioFn }
	| { type: "caption"; callback: UpdateVideoCaptionFn }
	| { type: "poster"; callback: UpdatePosterFn }
	| { type: "title"; callback: UpdateTitleFn }
	| { type: "controls"; callback: UpdateControlsFn }
	| { type: "autoplay"; callback: UpdateAutoplayFn }
	| { type: "loop"; callback: UpdateLoopFn }
	| { type: "muted"; callback: UpdateMutedFn }
	| { type: "swapCheckState"; callback: UpdateVideoSwapCheckStateFn };

export type VideoEditUpdateListenerParams = VideoEditListenerOption & {
	operation: "add" | "delete";
};

export type OnVideoCaptionEnabledChangeFn = (enabled: boolean) => void;
export type OnVideoCaptionPositionChangeFn = (
	position: VideoCaptionPosition,
) => void;

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

export interface VideoPopover {
	popover: HTMLDivElement;
	swapPopover: HTMLDivElement;
	updateState(params: UpdateVideoPopoverStateParams): void;
	onAlignChange(callback: OnVideoAlignChangeFn): () => void;
	onCaptionEnabledChange(callback: OnVideoCaptionEnabledChangeFn): () => void;
	onCaptionPositionChange(callback: OnVideoCaptionPositionChangeFn): () => void;
	onVideoAttrChange(callback: OnVideoAttrChangeFn): () => void;
	onDelete(callback: OnVideoDeleteFn): () => void;
	onSwap(callback: OnVideoSwapFn): () => void;
}
