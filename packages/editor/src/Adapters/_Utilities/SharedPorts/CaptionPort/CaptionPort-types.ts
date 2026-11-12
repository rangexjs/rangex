export type CaptionPosition = "above" | "below";

export interface CaptionState {
	captionEnabled: boolean;
	captionPosition: CaptionPosition;
}

export type OnCaptionEnabledUpdateCallbackFn = (captionEnabled: boolean) => void;
export type OnCaptionPositionUpdateCallbackFn = (captionPosition: CaptionPosition) => void;

export type OnChangeCaptionEnabledCallbackFn = (enabled: boolean) => void;
export type OnChangeCaptionPositionCallbackFn = (position: CaptionPosition) => void;

export interface UpdateStateParams {
	captionEnabled?: boolean;
	captionPosition?: CaptionPosition;
}

export interface CaptionConfigPort {
	readonly captionEnabled: boolean;
	readonly captionPosition: CaptionPosition;

	updateCaption(params: UpdateStateParams): void;

	onChangeCaptionEnabled(callback: OnChangeCaptionEnabledCallbackFn): () => void;
	onChangeCaptionPosition(callback: OnChangeCaptionPositionCallbackFn): () => void;
}

export interface CaptionPublicPort {
	readonly captionEnabled: boolean;
	readonly captionPosition: CaptionPosition;

	onCaptionEnabledUpdate(callback: OnCaptionEnabledUpdateCallbackFn): () => void;
	onCaptionPositionUpdate(callback: OnCaptionPositionUpdateCallbackFn): () => void;

	changeCaptionEnabled(enabled: boolean): void;
	changeCaptionPosition(position: CaptionPosition): void;
}

export interface CaptionPort {
	configPort: CaptionConfigPort;
	publicPort: CaptionPublicPort;
}

export interface CreateCaptionPortResult extends CaptionPort {}
