import type {
	BlockAlignPort,
	BlockAlignValue,
	CaptionPort,
	CaptionPosition,
	CaptionState,
	ConfigBlockResize,
	CreateAdapterConstructor,
	OnMediaResolveCallbackFn,
	PublicBlockResize,
} from "../_Utilities";

export interface ImageSettings {}

export type ImageAdapterConstructorParams =
	CreateAdapterConstructor<ImageSettings>;

export type ImageObjectFitValue = "cover" | "contain" | "fill";
export type ImageAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";

export interface ImageState {
	align?: BlockAlignValue;
	objectFit?: ImageObjectFitValue;
	aspectRatio?: ImageAspectRatioValue;
	caption?: CaptionState;
	altText?: string;
}

export interface UpdateImageStateParams extends ImageState {}

export interface OnImageAttrChangeCallbackParams {
	objectFit?: ImageObjectFitValue;
	aspectRatio?: ImageAspectRatioValue;
	altText?: string;
}

export type OnImageAttrChangeCallbackFn = (
	params: OnImageAttrChangeCallbackParams,
) => void;

export interface ImageConfigPort extends BlockAlignPort, CaptionPort {
	readonly blockResize: ConfigBlockResize;
	readonly floatingEl: HTMLDivElement;
	updateState(params: UpdateImageStateParams): void;
	onImageAttrChange(callback: OnImageAttrChangeCallbackFn): () => void;
	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export type OnAlignUpdateCallbackFn = (value: BlockAlignValue) => void;
export type OnObjectFitUpdateCallbackFn = (value: ImageObjectFitValue) => void;
export type OnAspectRationCallbackFn = (value: ImageAspectRatioValue) => void;
export type OnCaptionUpdateCallbackFn = (value: CaptionState) => void;
export type OnAltTextUpdateCallbackFn = (value: string) => void;

export interface ImagePublicPort {
	readonly blockResize: PublicBlockResize;
	readonly align: BlockAlignValue;
	readonly objectFit: ImageObjectFitValue;
	readonly aspectRatio: ImageAspectRatioValue;
	readonly caption: CaptionState;
	readonly altText: string;

	onAlignUpdate(callback: OnAlignUpdateCallbackFn): () => void;
	onObjectFitUpdate(callback: OnObjectFitUpdateCallbackFn): () => void;
	onAspectRatioUpdate(callback: OnAspectRationCallbackFn): () => void;
	onCaptionUpdate(callback: OnCaptionUpdateCallbackFn): () => void;
	onAltTextUpdate(callback: OnAltTextUpdateCallbackFn): () => void;

	changeAlign(align: BlockAlignValue): void;
	changeCaptionEnabled(enabled: boolean): void;
	changeCaptionPosition(position: CaptionPosition): void;
	changeImageAttr(params: OnImageAttrChangeCallbackParams): void;
}
