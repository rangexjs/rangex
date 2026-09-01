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

export interface Settings {}

export type ConstructorParams = CreateAdapterConstructor<Settings>;

export type ObjectFitValue = "cover" | "contain" | "fill";
export type AspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";

export interface ImageState {
	align?: BlockAlignValue;
	objectFit?: ObjectFitValue;
	aspectRatio?: AspectRatioValue;
	caption?: CaptionState;
	altText?: string;
	isOpen?: boolean;
}

export interface UpdateStateParams extends ImageState {}

export interface OnImageAttrChangeCallbackParams {
	objectFit?: ObjectFitValue;
	aspectRatio?: AspectRatioValue;
	altText?: string;
}

export type OnImageAttrChangeCallbackFn = (
	params: OnImageAttrChangeCallbackParams,
) => void;
export type OnToggleCallbackFn = (value: boolean) => void;

export interface ImageConfigPort extends BlockAlignPort, CaptionPort {
	readonly blockResize: BlockResize;
	readonly floatingEl: HTMLDivElement;
	updateState(params: UpdateStateParams): void;
	onImageAttrChange(callback: OnImageAttrChangeCallbackFn): () => void;
	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export type OnAlignUpdateCallbackFn = (value: BlockAlignValue) => void;
export type OnObjectFitUpdateCallbackFn = (value: ObjectFitValue) => void;
export type OnAspectRationCallbackFn = (value: AspectRatioValue) => void;
export type OnCaptionUpdateCallbackFn = (value: CaptionState) => void;
export type OnAltTextUpdateCallbackFn = (value: string) => void;

export interface ImagePublicPort {
	readonly align: BlockAlignValue;
	readonly objectFit: ObjectFitValue;
	readonly aspectRatio: AspectRatioValue;
	readonly caption: CaptionState;
	readonly altText: string;

	onAlignUpdate(callback: OnAlignUpdateCallbackFn): () => void;
	onObjectFitUpdate(callback: OnObjectFitUpdateCallbackFn): () => void;
	onAspectRatioUpdate(callback: OnAspectRationCallbackFn): () => void;
	onCaptionUpdate(callback: OnCaptionUpdateCallbackFn): () => void;
	onAltTextUpdate(callback: OnAltTextUpdateCallbackFn): () => void;
	onToggle(callback: OnToggleCallbackFn): () => void;

	changeAlign(align: BlockAlignValue): void;
	changeCaptionEnabled(enabled: boolean): void;
	changeCaptionPosition(position: CaptionPosition): void;
	changeImageAttr(params: OnImageAttrChangeCallbackParams): void;
}
