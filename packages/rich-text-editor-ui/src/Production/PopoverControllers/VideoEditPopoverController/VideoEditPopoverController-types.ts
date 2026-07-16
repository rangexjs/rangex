import type {
	BlockAlignValue,
	OnAlignChangeFn,
	OnDeleteFn,
	UpdateAlignFn,
} from "../ImageEditPopoverController";

export type OnVideoSwapPopoverOpenFn = () => void;

export type VideoObjectFitValue = "cover" | "contain" | "fill";
export type VideoAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";
export type VideoCaptionPosition = "above" | "below";

export interface VideoCaptionState {
	enabled: boolean;
	position: VideoCaptionPosition;
}

export interface VideoPlaybackState {
	controls: boolean;
	autoplay: boolean;
	loop: boolean;
	muted: boolean;
}

export interface VideoEditPopoverState {
	align?: BlockAlignValue;
	objectFit?: VideoObjectFitValue;
	aspectRatio?: VideoAspectRatioValue;
	caption?: VideoCaptionState;
	playback?: VideoPlaybackState;
	poster?: string;
	title?: string;
}

export interface UpdateVideoEditPopoverStateParams
	extends VideoEditPopoverState {}

export type UpdateVideoObjectFitFn = (value: VideoObjectFitValue) => void;
export type UpdateVideoAspectRatioFn = (value: VideoAspectRatioValue) => void;
export type UpdateVideoCaptionFn = (value: VideoCaptionState) => void;
export type UpdatePlaybackFn = (value: VideoPlaybackState) => void;
export type UpdatePosterFn = (value: string) => void;
export type UpdateTitleFn = (value: string) => void;

export type VideoEditListenerOption =
	| { type: "align"; callback: UpdateAlignFn }
	| { type: "objectFit"; callback: UpdateVideoObjectFitFn }
	| { type: "aspectRatio"; callback: UpdateVideoAspectRatioFn }
	| { type: "caption"; callback: UpdateVideoCaptionFn }
	| { type: "playback"; callback: UpdatePlaybackFn }
	| { type: "poster"; callback: UpdatePosterFn }
	| { type: "title"; callback: UpdateTitleFn };

export type VideoEditUpdateListenerParams = VideoEditListenerOption & {
	operation: "add" | "delete";
};

export type OnVideoObjectFitChangeFn = (objectFit: VideoObjectFitValue) => void;
export type OnVideoAspectRatioChangeFn = (
	aspectRatio: VideoAspectRatioValue,
) => void;
export type OnVideoCaptionEnabledChangeFn = (enabled: boolean) => void;
export type OnVideoCaptionPositionChangeFn = (
	position: VideoCaptionPosition,
) => void;
export type OnPlaybackChangeFn = (
	playback: Partial<VideoPlaybackState>,
) => void;
export type OnPosterChangeFn = (poster: string) => void;
export type OnTitleChangeFn = (title: string) => void;

export interface VideoEditPopover {
	popover: HTMLDivElement;
	updateState(params: UpdateVideoEditPopoverStateParams): void;
	onAlignChange(callback: OnAlignChangeFn): () => void;
	onObjectFitChange(callback: OnVideoObjectFitChangeFn): () => void;
	onAspectRatioChange(callback: OnVideoAspectRatioChangeFn): () => void;
	onCaptionEnabledChange(callback: OnVideoCaptionEnabledChangeFn): () => void;
	onCaptionPositionChange(callback: OnVideoCaptionPositionChangeFn): () => void;
	onPlaybackChange(callback: OnPlaybackChangeFn): () => void;
	onPosterChange(callback: OnPosterChangeFn): () => void;
	onTitleChange(callback: OnTitleChangeFn): () => void;
	onSwapPopoverOpen(callback: OnVideoSwapPopoverOpenFn): () => void;
	onDelete(callback: OnDeleteFn): () => void;
}
