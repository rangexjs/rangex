export type BlockAlignValue = "left" | "center" | "right";
export type ImageObjectFitValue = "cover" | "contain" | "fill";
export type ImageAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";
export type ImageCaptionPosition = "above" | "below";

export interface ImageCaptionState {
	enabled: boolean;
	position: ImageCaptionPosition;
}

export type ImageSwapCheckState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export interface ImagePopoverState {
	align?: BlockAlignValue;
	objectFit?: ImageObjectFitValue;
	aspectRatio?: ImageAspectRatioValue;
	caption?: ImageCaptionState;
	altText?: string;
	swapCheckState?: ImageSwapCheckState;
}

export interface UpdateImagePopoverStateParams extends ImagePopoverState {}

export type UpdateAlignFn = (value: BlockAlignValue) => void;
export type UpdateObjectFitFn = (value: ImageObjectFitValue) => void;
export type UpdateAspectRatioFn = (value: ImageAspectRatioValue) => void;
export type UpdateCaptionFn = (value: ImageCaptionState) => void;
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

export interface ImagePopover {
	popover: HTMLDivElement;
	swapPopover: HTMLDivElement;
	updateState(params: UpdateImagePopoverStateParams): void;
	onAlignChange(callback: OnAlignChangeFn): () => void;
	onCaptionEnabledChange(callback: OnCaptionEnabledChangeFn): () => void;
	onCaptionPositionChange(callback: OnCaptionPositionChangeFn): () => void;
	onImageAttrChange(callback: OnImageAttrChangeFn): () => void;
	onDelete(callback: OnDeleteFn): () => void;
	onSwap(callback: OnImageSwapFn): () => void;
}
