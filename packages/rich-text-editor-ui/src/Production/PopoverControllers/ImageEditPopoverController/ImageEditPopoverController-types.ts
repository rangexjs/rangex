export type BlockAlignValue = "left" | "center" | "right";
export type ImageObjectFitValue = "cover" | "contain" | "fill";
export type ImageAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";
export type ImageCaptionPosition = "above" | "below";

export interface ImageCaptionState {
	enabled: boolean;
	position: ImageCaptionPosition;
}

export interface ImageEditPopoverState {
	align?: BlockAlignValue;
	objectFit?: ImageObjectFitValue;
	aspectRatio?: ImageAspectRatioValue;
	caption?: ImageCaptionState;
	altText?: string;
}

export interface UpdateImageEditPopoverStateParams
	extends ImageEditPopoverState {}

export type UpdateAlignFn = (value: BlockAlignValue) => void;
export type UpdateObjectFitFn = (value: ImageObjectFitValue) => void;
export type UpdateAspectRatioFn = (value: ImageAspectRatioValue) => void;
export type UpdateCaptionFn = (value: ImageCaptionState) => void;
export type UpdateAltTextFn = (value: string) => void;

export type ImageEditListenerOption =
	| { type: "align"; callback: UpdateAlignFn }
	| { type: "objectFit"; callback: UpdateObjectFitFn }
	| { type: "aspectRatio"; callback: UpdateAspectRatioFn }
	| { type: "caption"; callback: UpdateCaptionFn }
	| { type: "altText"; callback: UpdateAltTextFn };

export type ImageEditUpdateListenerParams = ImageEditListenerOption & {
	operation: "add" | "delete";
};

export type OnAlignChangeFn = (align: BlockAlignValue) => void;
export type OnCaptionEnabledChangeFn = (enabled: boolean) => void;
export type OnCaptionPositionChangeFn = (
	position: ImageCaptionPosition,
) => void;

export interface ImageAttrChange {
	objectFit?: ImageObjectFitValue;
	aspectRatio?: ImageAspectRatioValue;
	altText?: string;
}

export type OnImageAttrChangeFn = (params: ImageAttrChange) => void;

export type OnDeleteFn = () => void;

export type OnSwapPopoverOpenFn = () => void;

export interface ImageEditPopover {
	popover: HTMLDivElement;
	updateState(params: UpdateImageEditPopoverStateParams): void;
	onAlignChange(callback: OnAlignChangeFn): () => void;
	onCaptionEnabledChange(callback: OnCaptionEnabledChangeFn): () => void;
	onCaptionPositionChange(callback: OnCaptionPositionChangeFn): () => void;
	onImageAttrChange(callback: OnImageAttrChangeFn): () => void;
	onDelete(callback: OnDeleteFn): () => void;
	onSwapPopoverOpen(callback: OnSwapPopoverOpenFn): () => void;
}
