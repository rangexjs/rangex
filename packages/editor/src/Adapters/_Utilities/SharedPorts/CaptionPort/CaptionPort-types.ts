export type CaptionPosition = "above" | "below";

export interface CaptionState {
	enabled: boolean;
	position: CaptionPosition;
}

export interface CaptionInternals {
	caption: CaptionState;
}

export interface UpdateStateParams {
	caption?: CaptionState;
}

export type OnCaptionEnabledChangeCallbackFn = (enabled: boolean) => void;
export type OnCaptionPositionChangeCallbackFn = (
	position: CaptionPosition,
) => void;

export interface CaptionConfigPort {
	setCaption(caption: CaptionState): void;

	onCaptionEnabledChange(
		callback: OnCaptionEnabledChangeCallbackFn,
	): () => void;
	onCaptionPositionChange(
		callback: OnCaptionPositionChangeCallbackFn,
	): () => void;
}

export type OnCaptionUpdateCallbackFn = (value: CaptionState) => void;

export interface CaptionPublicPort {
	readonly caption: CaptionState;

	onCaptionUpdate(callback: OnCaptionUpdateCallbackFn): () => void;

	changeCaptionEnabled(enabled: boolean): void;
	changeCaptionPosition(position: CaptionPosition): void;
}

export interface CaptionPort {
	configPort: CaptionConfigPort;
	publicPort: CaptionPublicPort;
}

export interface CreateCaptionPortResult extends CaptionPort {}
