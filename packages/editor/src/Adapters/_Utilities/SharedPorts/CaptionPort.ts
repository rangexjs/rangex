export type CaptionPosition = "above" | "below";

export interface CaptionState {
	enabled: boolean;
	position: CaptionPosition;
}

export type OnCaptionEnabledChangeCallbackFn = (enabled: boolean) => void;
export type OnCaptionPositionChangeCallbackFn = (
	position: CaptionPosition,
) => void;

export interface CaptionPort {
	onCaptionEnabledChange(
		callback: OnCaptionEnabledChangeCallbackFn,
	): () => void;
	onCaptionPositionChange(
		callback: OnCaptionPositionChangeCallbackFn,
	): () => void;
	setCaption(caption: CaptionState): void;
}
