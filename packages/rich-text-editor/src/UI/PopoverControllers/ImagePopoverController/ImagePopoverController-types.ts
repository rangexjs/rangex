import type {
	BlockAlignValue,
	CaptionState,
	ImageAspectRatioValue,
	ImageObjectFitValue,
	ImageSwapCheckState,
} from "#ports";

export type UpdateAlignFn = (value: BlockAlignValue) => void;
export type UpdateObjectFitFn = (value: ImageObjectFitValue) => void;
export type UpdateAspectRatioFn = (value: ImageAspectRatioValue) => void;
export type UpdateCaptionFn = (value: CaptionState) => void;
export type UpdateAltTextFn = (value: string) => void;
export type UpdateSwapCheckStateFn = (value: ImageSwapCheckState) => void;

export type ImageEditListenerOption =
	| { type: "align"; callback: UpdateAlignFn }
	| { type: "objectFit"; callback: UpdateObjectFitFn }
	| { type: "aspectRatio"; callback: UpdateAspectRatioFn }
	| { type: "caption"; callback: UpdateCaptionFn }
	| { type: "altText"; callback: UpdateAltTextFn }
	| { type: "swapCheckState"; callback: UpdateSwapCheckStateFn };

export type ImageEditUpdateListenerParams = ImageEditListenerOption & {
	operation: "add" | "delete";
};
