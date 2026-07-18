import type {
	BlockAlignValue,
	CaptionState,
	VideoAspectRatioValue,
	VideoObjectFitValue,
	VideoSwapCheckState,
} from "#ports";

export type UpdateVideoAlignFn = (value: BlockAlignValue) => void;
export type UpdateVideoObjectFitFn = (value: VideoObjectFitValue) => void;
export type UpdateVideoAspectRatioFn = (value: VideoAspectRatioValue) => void;
export type UpdateVideoCaptionFn = (value: CaptionState) => void;
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
