import type {
	BlockAlignPort,
	BlockAlignValue,
	BlockResize,
	CaptionPort,
	CaptionPosition,
	CaptionState,
	CreateAdapterConstructor,
	OnMediaResolveCallbackFn,
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
	isOpen?: boolean;
}

export interface UpdateImageStateParams extends ImageState {}

export interface OnImageAttrChangeCallbackParams {
	objectFit?: ImageObjectFitValue;
	aspectRatio?: ImageAspectRatioValue;
	altText?: string;
}

export type ImageOnImageAttrChangeCallbackFn = (
	params: OnImageAttrChangeCallbackParams,
) => void;
export type ImageOnToggleCallbackFn = (value: boolean) => void;

export interface ImageConfigPort extends BlockAlignPort, CaptionPort {
	readonly blockResize: BlockResize;
	readonly floatingEl: HTMLDivElement;
	updateState(params: UpdateImageStateParams): void;
	onImageAttrChange(callback: ImageOnImageAttrChangeCallbackFn): () => void;
	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export type ImageOnAlignUpdateCallbackFn = (value: BlockAlignValue) => void;
export type ImageOnObjectFitUpdateCallbackFn = (
	value: ImageObjectFitValue,
) => void;
export type ImageOnAspectRationCallbackFn = (
	value: ImageAspectRatioValue,
) => void;
export type ImageOnCaptionUpdateCallbackFn = (value: CaptionState) => void;
export type ImageOnAltTextUpdateCallbackFn = (value: string) => void;

export interface ImagePublicPort {
	readonly align: BlockAlignValue;
	readonly objectFit: ImageObjectFitValue;
	readonly aspectRatio: ImageAspectRatioValue;
	readonly caption: CaptionState;
	readonly altText: string;

	onAlignUpdate(callback: ImageOnAlignUpdateCallbackFn): () => void;
	onObjectFitUpdate(callback: ImageOnObjectFitUpdateCallbackFn): () => void;
	onAspectRatioUpdate(callback: ImageOnAspectRationCallbackFn): () => void;
	onCaptionUpdate(callback: ImageOnCaptionUpdateCallbackFn): () => void;
	onAltTextUpdate(callback: ImageOnAltTextUpdateCallbackFn): () => void;
	onToggle(callback: ImageOnToggleCallbackFn): () => void;

	changeAlign(align: BlockAlignValue): void;
	changeCaptionEnabled(enabled: boolean): void;
	changeCaptionPosition(position: CaptionPosition): void;
	changeImageAttr(params: OnImageAttrChangeCallbackParams): void;
}
