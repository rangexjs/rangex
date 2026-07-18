import type {
	AudioSwapCheckState,
	BlockAlignValue,
	CaptionState,
} from "#ports";

export type UpdateAudioAlignFn = (value: BlockAlignValue) => void;
export type UpdateAudioCaptionFn = (value: CaptionState) => void;
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
