import type { CreateAdapterConstructor, MediaResolveParams } from "#ports";
import type {
	BlockAlignPort,
	BlockAlignValue,
	CaptionPort,
	CaptionPosition,
	CaptionState,
	EditorBlockResize,
	EditorOverlayMount,
	UIBlockResize,
	UIOverlayMount,
	UploadMediaFileFn,
} from "../_Utilities";

export interface AudioSettings {
	uploadFile: UploadMediaFileFn;
}

export type AudioAdapterConstructorParams =
	CreateAdapterConstructor<AudioSettings>;

export type AudioSwapCheckState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export interface AudioState {
	align?: BlockAlignValue;
	caption?: CaptionState;
	title?: string;
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	swapCheckState?: AudioSwapCheckState;
	isQuickActionsOpen?: boolean;
	isSwapCardOpen?: boolean;
}

export interface UpdateAudioStateParams extends AudioState {}

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
export type AudioUpdateIsQuickActionsOpenFn = (value: boolean) => void;
export type AudioUpdateIsSwapCardOpenFn = (value: boolean) => void;

export interface AudioUIPort {
	readonly quickActionsOverlay: UIOverlayMount;
	readonly swapCardOverlay: UIOverlayMount;
	readonly blockResize: UIBlockResize;
	readonly align: BlockAlignValue;
	readonly caption: CaptionState;
	readonly title: string;
	readonly controls: boolean;
	readonly autoplay: boolean;
	readonly loop: boolean;
	readonly muted: boolean;
	readonly swapCheckState: AudioSwapCheckState;
	readonly isSwapCardOpen: boolean;
	onAlignUpdate(callback: AudioUpdateAlignFn): () => void;
	onCaptionUpdate(callback: AudioUpdateCaptionFn): () => void;
	onTitleUpdate(callback: AudioUpdateTitleFn): () => void;
	onControlsUpdate(callback: AudioUpdateControlsFn): () => void;
	onAutoplayUpdate(callback: AudioUpdateAutoplayFn): () => void;
	onLoopUpdate(callback: AudioUpdateLoopFn): () => void;
	onMutedUpdate(callback: AudioUpdateMutedFn): () => void;
	onSwapCheckStateUpdate(callback: AudioUpdateSwapCheckStateFn): () => void;
	onIsQuickActionsOpenUpdate(
		callback: AudioUpdateIsQuickActionsOpenFn,
	): () => void;
	onIsSwapCardOpenUpdate(callback: AudioUpdateIsSwapCardOpenFn): () => void;
	emitAlignChange(align: BlockAlignValue): void;
	emitCaptionEnabledChange(enabled: boolean): void;
	emitCaptionPositionChange(position: CaptionPosition): void;
	emitAudioAttrChange(params: AudioAttrChange): void;
	emitSwap(params: AudioEmitSwapParams): void;
	emitToggleSwap(): void;
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
export type OnAudioToggleSwapFn = () => void;

export interface AudioEditorPort extends BlockAlignPort, CaptionPort {
	readonly quickActionsOverlay: EditorOverlayMount;
	readonly swapCardOverlay: EditorOverlayMount;
	readonly blockResize: EditorBlockResize;
	readonly uploadFile: UploadMediaFileFn;
	updateState(params: UpdateAudioStateParams): void;
	onAudioAttrChange(callback: OnAudioAttrChangeFn): () => void;
	onSwap(callback: OnAudioSwapFn): () => void;
	onToggleSwap(callback: OnAudioToggleSwapFn): () => void;
	onMediaResolve(callback: (params: MediaResolveParams) => void): () => void;
}
