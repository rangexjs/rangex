import type { CreateAdapterConstructor, MediaResolveParams } from "#ports";
import type {
	BlockAlignPort,
	BlockAlignValue,
	CaptionPort,
	CaptionPosition,
	CaptionState,
	DeletePort,
	EditorBlockResize,
	EditorOverlayMount,
	UIBlockResize,
	UIOverlayMount,
} from "../_Utilities";

export type ImageAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export type ImageObjectFitValue = "cover" | "contain" | "fill";
export type ImageAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";

export type ImageSwapCheckState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export interface ImagePopoverState {
	align?: BlockAlignValue;
	objectFit?: ImageObjectFitValue;
	aspectRatio?: ImageAspectRatioValue;
	caption?: CaptionState;
	altText?: string;
	swapCheckState?: ImageSwapCheckState;
}

export interface UpdateImageStateParams extends ImagePopoverState {}

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

export type ImageUpdateAlignFn = (value: BlockAlignValue) => void;
export type ImageUpdateObjectFitFn = (value: ImageObjectFitValue) => void;
export type ImageUpdateAspectRatioFn = (value: ImageAspectRatioValue) => void;
export type ImageUpdateCaptionFn = (value: CaptionState) => void;
export type ImageUpdateAltTextFn = (value: string) => void;
export type ImageUpdateSwapCheckStateFn = (value: ImageSwapCheckState) => void;

export interface ImageUISwapPopover {
	setElement: (element: HTMLDivElement) => void;
}

export interface ImageUIPort {
	readonly popover: UIOverlayMount;
	readonly swapPopover: ImageUISwapPopover;
	readonly blockResize: UIBlockResize;
	readonly align: BlockAlignValue;
	readonly objectFit: ImageObjectFitValue;
	readonly aspectRatio: ImageAspectRatioValue;
	readonly caption: CaptionState;
	readonly altText: string;
	readonly swapCheckState: ImageSwapCheckState;
	onAlignUpdate(callback: ImageUpdateAlignFn): () => void;
	onObjectFitUpdate(callback: ImageUpdateObjectFitFn): () => void;
	onAspectRatioUpdate(callback: ImageUpdateAspectRatioFn): () => void;
	onCaptionUpdate(callback: ImageUpdateCaptionFn): () => void;
	onAltTextUpdate(callback: ImageUpdateAltTextFn): () => void;
	onSwapCheckStateUpdate(callback: ImageUpdateSwapCheckStateFn): () => void;
	emitAlignChange(align: BlockAlignValue): void;
	emitCaptionEnabledChange(enabled: boolean): void;
	emitCaptionPositionChange(position: CaptionPosition): void;
	emitImageAttrChange(params: ImageAttrChange): void;
	emitSwap(params: ImageEmitSwapParams): void;
	emitDelete(): void;
}

export interface ImageEditorSwapPopover {
	readonly element: HTMLDivElement;
}

export interface ImageAttrChange {
	objectFit?: ImageObjectFitValue;
	aspectRatio?: ImageAspectRatioValue;
	altText?: string;
}

export type OnImageAttrChangeFn = (params: ImageAttrChange) => void;
export type OnImageSwapFn = (params: ImageEmitSwapParams) => void;

export interface ImageEditorPort
	extends BlockAlignPort,
		CaptionPort,
		DeletePort {
	readonly popover: EditorOverlayMount;
	readonly swapPopover: ImageEditorSwapPopover;
	readonly blockResize: EditorBlockResize;
	updateState(params: UpdateImageStateParams): void;
	onImageAttrChange(callback: OnImageAttrChangeFn): () => void;
	onSwap(callback: OnImageSwapFn): () => void;
	onMediaResolve(callback: (params: MediaResolveParams) => void): () => void;
}
