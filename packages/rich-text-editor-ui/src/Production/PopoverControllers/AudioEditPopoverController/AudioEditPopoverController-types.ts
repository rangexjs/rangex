import type {
	BlockAlignValue,
	OnAlignChangeFn,
	OnDeleteFn,
	UpdateAlignFn,
} from "../ImageEditPopoverController";

export type OnAudioSwapPopoverOpenFn = () => void;

export type AudioCaptionPosition = "above" | "below";

export interface AudioCaptionState {
	enabled: boolean;
	position: AudioCaptionPosition;
}

export interface AudioEditPopoverState {
	align?: BlockAlignValue;
	caption?: AudioCaptionState;
	title?: string;
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
}

export interface UpdateAudioEditPopoverStateParams
	extends AudioEditPopoverState {}

export type UpdateAudioCaptionFn = (value: AudioCaptionState) => void;
export type UpdateAudioTitleFn = (value: string) => void;
export type UpdateAudioControlsFn = (value: boolean) => void;
export type UpdateAudioAutoplayFn = (value: boolean) => void;
export type UpdateAudioLoopFn = (value: boolean) => void;
export type UpdateAudioMutedFn = (value: boolean) => void;

export type AudioEditListenerOption =
	| { type: "align"; callback: UpdateAlignFn }
	| { type: "caption"; callback: UpdateAudioCaptionFn }
	| { type: "title"; callback: UpdateAudioTitleFn }
	| { type: "controls"; callback: UpdateAudioControlsFn }
	| { type: "autoplay"; callback: UpdateAudioAutoplayFn }
	| { type: "loop"; callback: UpdateAudioLoopFn }
	| { type: "muted"; callback: UpdateAudioMutedFn };

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

export interface AudioEditPopover {
	popover: HTMLDivElement;
	updateState(params: UpdateAudioEditPopoverStateParams): void;
	onAlignChange(callback: OnAlignChangeFn): () => void;
	onCaptionEnabledChange(callback: OnAudioCaptionEnabledChangeFn): () => void;
	onCaptionPositionChange(callback: OnAudioCaptionPositionChangeFn): () => void;
	onAudioAttrChange(callback: OnAudioAttrChangeFn): () => void;
	onSwapPopoverOpen(callback: OnAudioSwapPopoverOpenFn): () => void;
	onDelete(callback: OnDeleteFn): () => void;
}
