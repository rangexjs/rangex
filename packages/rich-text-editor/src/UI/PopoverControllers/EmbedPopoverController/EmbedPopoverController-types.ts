import type {
	BlockAlignValue,
	CaptionState,
	EmbedAspectRatioValue,
	EmbedSwapCheckState,
} from "#ports";

export type UpdateEmbedAlignFn = (value: BlockAlignValue) => void;
export type UpdateEmbedAspectRatioFn = (value: EmbedAspectRatioValue) => void;
export type UpdateEmbedCaptionFn = (value: CaptionState) => void;
export type UpdateEmbedTitleFn = (value: string) => void;
export type UpdateEmbedSwapCheckStateFn = (value: EmbedSwapCheckState) => void;

export type EmbedEditListenerOption =
	| { type: "align"; callback: UpdateEmbedAlignFn }
	| { type: "aspectRatio"; callback: UpdateEmbedAspectRatioFn }
	| { type: "caption"; callback: UpdateEmbedCaptionFn }
	| { type: "title"; callback: UpdateEmbedTitleFn }
	| { type: "swapCheckState"; callback: UpdateEmbedSwapCheckStateFn };

export type EmbedEditUpdateListenerParams = EmbedEditListenerOption & {
	operation: "add" | "delete";
};
