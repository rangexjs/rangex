export type BlockAlignValue = "left" | "center" | "right";
export type ImageObjectFitValue = "cover" | "contain" | "fill";
export type ImageAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";
export type ImageCaptionPosition = "above" | "below";

export interface ImageCaptionState {
	enabled: boolean;
	position: ImageCaptionPosition;
}

export interface ImagePopoverState {
	align?: BlockAlignValue;
	objectFit?: ImageObjectFitValue;
	aspectRatio?: ImageAspectRatioValue;
	caption?: ImageCaptionState;
	altText?: string;
}

export interface UpdateImagePopoverStateParams extends ImagePopoverState {}

export type UpdateAlignFn = (value: BlockAlignValue) => void;
export type UpdateObjectFitFn = (value: ImageObjectFitValue) => void;
export type UpdateAspectRatioFn = (value: ImageAspectRatioValue) => void;
export type UpdateCaptionFn = (value: ImageCaptionState) => void;
export type UpdateAltTextFn = (value: string) => void;

export type ImageListenerOption =
	| { type: "align"; callback: UpdateAlignFn }
	| { type: "objectFit"; callback: UpdateObjectFitFn }
	| { type: "aspectRatio"; callback: UpdateAspectRatioFn }
	| { type: "caption"; callback: UpdateCaptionFn }
	| { type: "altText"; callback: UpdateAltTextFn };

export type ImageUpdateListenerParams = ImageListenerOption & {
	operation: "add" | "delete";
};

export type OnAlignChangeFn = (align: BlockAlignValue) => void;
export type OnObjectFitChangeFn = (objectFit: ImageObjectFitValue) => void;
export type OnAspectRatioChangeFn = (
	aspectRatio: ImageAspectRatioValue,
) => void;
export type OnCaptionEnabledChangeFn = (enabled: boolean) => void;
export type OnCaptionPositionChangeFn = (
	position: ImageCaptionPosition,
) => void;
export type OnAltTextChangeFn = (altText: string) => void;

export interface EmitSwapURLParams {
	source: "url";
	url: string;
}

export interface EmitSwapFileUploadParams {
	source: "file-upload";
	files: FileList;
}

export type EmitSwapParams = EmitSwapURLParams | EmitSwapFileUploadParams;

export type OnSwapFn = (params: EmitSwapParams) => void;

export type OnDeleteFn = () => void;

export interface ImagePopover {
	popover: HTMLDivElement;
	updateState(params: UpdateImagePopoverStateParams): void;
	onAlignChange(callback: OnAlignChangeFn): () => void;
	onObjectFitChange(callback: OnObjectFitChangeFn): () => void;
	onAspectRatioChange(callback: OnAspectRatioChangeFn): () => void;
	onCaptionEnabledChange(callback: OnCaptionEnabledChangeFn): () => void;
	onCaptionPositionChange(callback: OnCaptionPositionChangeFn): () => void;
	onAltTextChange(callback: OnAltTextChangeFn): () => void;
	onSwap(callback: OnSwapFn): () => void;
	onDelete(callback: OnDeleteFn): () => void;
}
