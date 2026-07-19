import type { BlockAlignPort, BlockAlignValue } from "./_Shared/BlockAlignPort";
import type { CaptionPort, CaptionState } from "./_Shared/CaptionPort";
import type { DeletePort } from "./_Shared/DeletePort";

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

export interface UpdateAudioPopoverStateParams extends AudioPopoverState {}

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

export interface AudioPort extends BlockAlignPort, CaptionPort, DeletePort {
	popover: HTMLDivElement;
	swapPopover: HTMLDivElement;
	updateState(params: UpdateAudioPopoverStateParams): void;
	onAudioAttrChange(callback: OnAudioAttrChangeFn): () => void;
	onSwap(callback: OnAudioSwapFn): () => void;
}
