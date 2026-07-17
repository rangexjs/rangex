export type VideoBlockAlignValue = "left" | "center" | "right";
export type OnVideoAlignChangeFn = (align: VideoBlockAlignValue) => void;
export type UpdateVideoAlignFn = (value: VideoBlockAlignValue) => void;
export type OnVideoDeleteFn = () => void;

export type OnVideoSwapPopoverOpenFn = () => void;

export type VideoObjectFitValue = "cover" | "contain" | "fill";
export type VideoAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";
export type VideoCaptionPosition = "above" | "below";

export interface VideoCaptionState {
	enabled: boolean;
	position: VideoCaptionPosition;
}

export interface VideoEditPopoverState {
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
}

export interface UpdateVideoEditPopoverStateParams
	extends VideoEditPopoverState {}

export type UpdateVideoObjectFitFn = (value: VideoObjectFitValue) => void;
export type UpdateVideoAspectRatioFn = (value: VideoAspectRatioValue) => void;
export type UpdateVideoCaptionFn = (value: VideoCaptionState) => void;
export type UpdatePosterFn = (value: string) => void;
export type UpdateTitleFn = (value: string) => void;
export type UpdateControlsFn = (value: boolean) => void;
export type UpdateAutoplayFn = (value: boolean) => void;
export type UpdateLoopFn = (value: boolean) => void;
export type UpdateMutedFn = (value: boolean) => void;

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
	| { type: "muted"; callback: UpdateMutedFn };

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

export interface VideoEditPopover {
	popover: HTMLDivElement;
	updateState(params: UpdateVideoEditPopoverStateParams): void;
	onAlignChange(callback: OnVideoAlignChangeFn): () => void;
	onCaptionEnabledChange(callback: OnVideoCaptionEnabledChangeFn): () => void;
	onCaptionPositionChange(callback: OnVideoCaptionPositionChangeFn): () => void;
	onVideoAttrChange(callback: OnVideoAttrChangeFn): () => void;
	onSwapPopoverOpen(callback: OnVideoSwapPopoverOpenFn): () => void;
	onDelete(callback: OnVideoDeleteFn): () => void;
}
