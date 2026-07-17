import type {
	BlockAlignValue,
	OnAlignChangeFn,
	OnDeleteFn,
	UpdateAlignFn,
} from "../ImageEditPopoverController";

export type OnEmbedSwapPopoverOpenFn = () => void;

export type EmbedAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";
export type EmbedCaptionPosition = "above" | "below";

export interface EmbedCaptionState {
	enabled: boolean;
	position: EmbedCaptionPosition;
}

export interface EmbedEditPopoverState {
	align?: BlockAlignValue;
	aspectRatio?: EmbedAspectRatioValue;
	caption?: EmbedCaptionState;
	title?: string;
}

export interface UpdateEmbedEditPopoverStateParams
	extends EmbedEditPopoverState {}

export type UpdateEmbedAspectRatioFn = (value: EmbedAspectRatioValue) => void;
export type UpdateEmbedCaptionFn = (value: EmbedCaptionState) => void;
export type UpdateEmbedTitleFn = (value: string) => void;

export type EmbedEditListenerOption =
	| { type: "align"; callback: UpdateAlignFn }
	| { type: "aspectRatio"; callback: UpdateEmbedAspectRatioFn }
	| { type: "caption"; callback: UpdateEmbedCaptionFn }
	| { type: "title"; callback: UpdateEmbedTitleFn };

export type EmbedEditUpdateListenerParams = EmbedEditListenerOption & {
	operation: "add" | "delete";
};

export type OnEmbedCaptionEnabledChangeFn = (enabled: boolean) => void;
export type OnEmbedCaptionPositionChangeFn = (
	position: EmbedCaptionPosition,
) => void;

export interface EmbedAttrChange {
	aspectRatio?: EmbedAspectRatioValue;
	title?: string;
}

export type OnEmbedAttrChangeFn = (params: EmbedAttrChange) => void;

export interface EmbedEditPopover {
	popover: HTMLDivElement;
	updateState(params: UpdateEmbedEditPopoverStateParams): void;
	onAlignChange(callback: OnAlignChangeFn): () => void;
	onCaptionEnabledChange(callback: OnEmbedCaptionEnabledChangeFn): () => void;
	onCaptionPositionChange(callback: OnEmbedCaptionPositionChangeFn): () => void;
	onEmbedAttrChange(callback: OnEmbedAttrChangeFn): () => void;
	onSwapPopoverOpen(callback: OnEmbedSwapPopoverOpenFn): () => void;
	onDelete(callback: OnDeleteFn): () => void;
}
