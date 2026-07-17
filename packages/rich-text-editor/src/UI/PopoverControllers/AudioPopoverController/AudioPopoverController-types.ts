export type AudioBlockAlignValue = "left" | "center" | "right";
export type OnAudioAlignChangeFn = (align: AudioBlockAlignValue) => void;
export type UpdateAudioAlignFn = (value: AudioBlockAlignValue) => void;
export type OnAudioDeleteFn = () => void;

export type AudioCaptionPosition = "above" | "below";

export interface AudioCaptionState {
	enabled: boolean;
	position: AudioCaptionPosition;
}

export type AudioSwapCheckState =
	| { status: "idle" }
	| { status: "checking" }
	| { status: "uploading"; progress: number }
	| { status: "error"; message: string };

export interface AudioPopoverState {
	align?: AudioBlockAlignValue;
	caption?: AudioCaptionState;
	title?: string;
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	swapCheckState?: AudioSwapCheckState;
}

export interface UpdateAudioPopoverStateParams extends AudioPopoverState {}

export type UpdateAudioCaptionFn = (value: AudioCaptionState) => void;
export type UpdateAudioTitleFn = (value: string) => void;
export type UpdateAudioControlsFn = (value: boolean) => void;
export type UpdateAudioAutoplayFn = (value: boolean) => void;
export type UpdateAudioLoopFn = (value: boolean) => void;
export type UpdateAudioMutedFn = (value: boolean) => void;
export type UpdateAudioSwapCheckStateFn = (value: AudioSwapCheckState) => void;

export type AudioEditListenerOption =
	| { type: "align"; callback: UpdateAudioAlignFn }
	| { type: "caption"; callback: UpdateAudioCaptionFn }
	| { type: "title"; callback: UpdateAudioTitleFn }
	| { type: "controls"; callback: UpdateAudioControlsFn }
	| { type: "autoplay"; callback: UpdateAudioAutoplayFn }
	| { type: "loop"; callback: UpdateAudioLoopFn }
	| { type: "muted"; callback: UpdateAudioMutedFn }
	| { type: "swapCheckState"; callback: UpdateAudioSwapCheckStateFn };

export type AudioEditUpdateListenerParams = AudioEditListenerOption & {
	operation: "add" | "delete";
};

export type OnAudioCaptionEnabledChangeFn = (enabled: boolean) => void;
export type OnAudioCaptionPositionChangeFn = (
	position: AudioCaptionPosition,
) => void;

export interface AudioAttrChange {
	title?: string;
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
}

export type OnAudioAttrChangeFn = (params: AudioAttrChange) => void;

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

export type OnAudioSwapFn = (params: AudioEmitSwapParams) => void;

export interface AudioPopover {
	popover: HTMLDivElement;
	swapPopover: HTMLDivElement;
	updateState(params: UpdateAudioPopoverStateParams): void;
	onAlignChange(callback: OnAudioAlignChangeFn): () => void;
	onCaptionEnabledChange(callback: OnAudioCaptionEnabledChangeFn): () => void;
	onCaptionPositionChange(callback: OnAudioCaptionPositionChangeFn): () => void;
	onAudioAttrChange(callback: OnAudioAttrChangeFn): () => void;
	onDelete(callback: OnAudioDeleteFn): () => void;
	onSwap(callback: OnAudioSwapFn): () => void;
}
