export type CaptionPosition = "above" | "below";

export interface CaptionState {
	enabled: boolean;
	position: CaptionPosition;
}

export type OnCaptionEnabledChangeFn = (enabled: boolean) => void;
export type OnCaptionPositionChangeFn = (position: CaptionPosition) => void;

export interface CaptionPort {
	onCaptionEnabledChange(callback: OnCaptionEnabledChangeFn): () => void;
	onCaptionPositionChange(callback: OnCaptionPositionChangeFn): () => void;
	setCaption(caption: CaptionState): void;
}
