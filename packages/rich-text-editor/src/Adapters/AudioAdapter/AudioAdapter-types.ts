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

export type AudioAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export type AudioSwapCheckState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export interface AudioPopoverState {
	align?: BlockAlignValue;
	caption?: CaptionState;
	title?: string;
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	swapCheckState?: AudioSwapCheckState;
}

export interface UpdateAudioStateParams extends AudioPopoverState {}

export interface AudioEmitSwapURLParams {
	source: "url";
	url: string;
}

export interface AudioEmitSwapFileUploadParams {
	source: "file-upload";
	files: FileList;
}

export type AudioEmitSwapParams =
	| AudioEmitSwapURLParams
	| AudioEmitSwapFileUploadParams;

export type AudioUpdateAlignFn = (value: BlockAlignValue) => void;
export type AudioUpdateCaptionFn = (value: CaptionState) => void;
export type AudioUpdateTitleFn = (value: string) => void;
export type AudioUpdateControlsFn = (value: boolean) => void;
export type AudioUpdateAutoplayFn = (value: boolean) => void;
export type AudioUpdateLoopFn = (value: boolean) => void;
export type AudioUpdateMutedFn = (value: boolean) => void;
export type AudioUpdateSwapCheckStateFn = (value: AudioSwapCheckState) => void;

export interface AudioUISwapPopover {
	setElement: (element: HTMLDivElement) => void;
}

export interface AudioUIPort {
	readonly popover: UIOverlayMount;
	readonly swapPopover: AudioUISwapPopover;
	readonly blockResize: UIBlockResize;
	readonly align: BlockAlignValue;
	readonly caption: CaptionState;
	readonly title: string;
	readonly controls: boolean;
	readonly autoplay: boolean;
	readonly loop: boolean;
	readonly muted: boolean;
	readonly swapCheckState: AudioSwapCheckState;
	onAlignUpdate(callback: AudioUpdateAlignFn): () => void;
	onCaptionUpdate(callback: AudioUpdateCaptionFn): () => void;
	onTitleUpdate(callback: AudioUpdateTitleFn): () => void;
	onControlsUpdate(callback: AudioUpdateControlsFn): () => void;
	onAutoplayUpdate(callback: AudioUpdateAutoplayFn): () => void;
	onLoopUpdate(callback: AudioUpdateLoopFn): () => void;
	onMutedUpdate(callback: AudioUpdateMutedFn): () => void;
	onSwapCheckStateUpdate(callback: AudioUpdateSwapCheckStateFn): () => void;
	emitAlignChange(align: BlockAlignValue): void;
	emitCaptionEnabledChange(enabled: boolean): void;
	emitCaptionPositionChange(position: CaptionPosition): void;
	emitAudioAttrChange(params: AudioAttrChange): void;
	emitSwap(params: AudioEmitSwapParams): void;
	emitDelete(): void;
}

export interface AudioEditorSwapPopover {
	readonly element: HTMLDivElement;
}

export interface AudioAttrChange {
	title?: string;
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
}

export type OnAudioAttrChangeFn = (params: AudioAttrChange) => void;
export type OnAudioSwapFn = (params: AudioEmitSwapParams) => void;

export interface AudioEditorPort
	extends BlockAlignPort,
		CaptionPort,
		DeletePort {
	readonly popover: EditorOverlayMount;
	readonly swapPopover: AudioEditorSwapPopover;
	readonly blockResize: EditorBlockResize;
	updateState(params: UpdateAudioStateParams): void;
	onAudioAttrChange(callback: OnAudioAttrChangeFn): () => void;
	onSwap(callback: OnAudioSwapFn): () => void;
	onMediaResolve(callback: (params: MediaResolveParams) => void): () => void;
}
