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

export type VideoAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export type VideoObjectFitValue = "cover" | "contain" | "fill";
export type VideoAspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";

export type VideoSwapCheckState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export interface VideoPopoverState {
	align?: BlockAlignValue;
	objectFit?: VideoObjectFitValue;
	aspectRatio?: VideoAspectRatioValue;
	caption?: CaptionState;
	poster?: string;
	title?: string;
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	swapCheckState?: VideoSwapCheckState;
}

export interface UpdateVideoStateParams extends VideoPopoverState {}

export interface VideoEmitSwapURLParams {
	source: "url";
	url: string;
}

export interface VideoEmitSwapFileUploadParams {
	source: "file-upload";
	files: FileList;
}

export type VideoEmitSwapParams =
	| VideoEmitSwapURLParams
	| VideoEmitSwapFileUploadParams;

export type VideoUpdateAlignFn = (value: BlockAlignValue) => void;
export type VideoUpdateObjectFitFn = (value: VideoObjectFitValue) => void;
export type VideoUpdateAspectRatioFn = (value: VideoAspectRatioValue) => void;
export type VideoUpdateCaptionFn = (value: CaptionState) => void;
export type VideoUpdatePosterFn = (value: string) => void;
export type VideoUpdateTitleFn = (value: string) => void;
export type VideoUpdateControlsFn = (value: boolean) => void;
export type VideoUpdateAutoplayFn = (value: boolean) => void;
export type VideoUpdateLoopFn = (value: boolean) => void;
export type VideoUpdateMutedFn = (value: boolean) => void;
export type VideoUpdateSwapCheckStateFn = (value: VideoSwapCheckState) => void;

export interface VideoUISwapPopover {
	setElement: (element: HTMLDivElement) => void;
}

export interface VideoUIPort {
	readonly popover: UIOverlayMount;
	readonly swapPopover: VideoUISwapPopover;
	readonly blockResize: UIBlockResize;
	readonly align: BlockAlignValue;
	readonly objectFit: VideoObjectFitValue;
	readonly aspectRatio: VideoAspectRatioValue;
	readonly caption: CaptionState;
	readonly poster: string;
	readonly title: string;
	readonly controls: boolean;
	readonly autoplay: boolean;
	readonly loop: boolean;
	readonly muted: boolean;
	readonly swapCheckState: VideoSwapCheckState;
	onAlignUpdate(callback: VideoUpdateAlignFn): () => void;
	onObjectFitUpdate(callback: VideoUpdateObjectFitFn): () => void;
	onAspectRatioUpdate(callback: VideoUpdateAspectRatioFn): () => void;
	onCaptionUpdate(callback: VideoUpdateCaptionFn): () => void;
	onPosterUpdate(callback: VideoUpdatePosterFn): () => void;
	onTitleUpdate(callback: VideoUpdateTitleFn): () => void;
	onControlsUpdate(callback: VideoUpdateControlsFn): () => void;
	onAutoplayUpdate(callback: VideoUpdateAutoplayFn): () => void;
	onLoopUpdate(callback: VideoUpdateLoopFn): () => void;
	onMutedUpdate(callback: VideoUpdateMutedFn): () => void;
	onSwapCheckStateUpdate(callback: VideoUpdateSwapCheckStateFn): () => void;
	emitAlignChange(align: BlockAlignValue): void;
	emitCaptionEnabledChange(enabled: boolean): void;
	emitCaptionPositionChange(position: CaptionPosition): void;
	emitVideoAttrChange(params: VideoAttrChange): void;
	emitSwap(params: VideoEmitSwapParams): void;
	emitDelete(): void;
}

export interface VideoEditorSwapPopover {
	readonly element: HTMLDivElement;
}

export interface VideoAttrChange {
	objectFit?: VideoObjectFitValue;
	aspectRatio?: VideoAspectRatioValue;
	title?: string;
	poster?: string;
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
}

export type OnVideoAttrChangeFn = (params: VideoAttrChange) => void;
export type OnVideoSwapFn = (params: VideoEmitSwapParams) => void;

export interface VideoEditorPort
	extends BlockAlignPort,
		CaptionPort,
		DeletePort {
	readonly popover: EditorOverlayMount;
	readonly swapPopover: VideoEditorSwapPopover;
	readonly blockResize: EditorBlockResize;
	updateState(params: UpdateVideoStateParams): void;
	onVideoAttrChange(callback: OnVideoAttrChangeFn): () => void;
	onSwap(callback: OnVideoSwapFn): () => void;
	onMediaResolve(callback: (params: MediaResolveParams) => void): () => void;
}
