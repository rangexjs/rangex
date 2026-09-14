import type {
	CaptionConfigPort,
	CaptionInternals,
	CaptionPublicPort,
	CreateCaptionPortResult,
	OnCaptionEnabledUpdateCallbackFn,
	OnCaptionPositionUpdateCallbackFn,
	OnChangeCaptionEnabledCallbackFn,
	OnChangeCaptionPositionCallbackFn,
	UpdateStateParams,
} from "./CaptionPort-types";

export const createCaptionPort = (): CreateCaptionPortResult => {
	const internals: CaptionInternals = {
		captionEnabled: false,
		captionPosition: "below",
	};

	// StateListeners
	const onCaptionEnabledUpdateListeners: Set<OnCaptionEnabledUpdateCallbackFn> =
		new Set();
	const onCaptionPositionUpdateListeners: Set<OnCaptionPositionUpdateCallbackFn> =
		new Set();

	// CommandListeners
	const onChangeCaptionEnabledListeners: Set<OnChangeCaptionEnabledCallbackFn> =
		new Set();
	const onChangeCaptionPositionListeners: Set<OnChangeCaptionPositionCallbackFn> =
		new Set();

	const updateState = ({
		captionEnabled,
		captionPosition,
	}: UpdateStateParams) => {
		if (captionEnabled !== undefined) {
			internals.captionEnabled = captionEnabled;

			for (const listener of onCaptionEnabledUpdateListeners) {
				listener(internals.captionEnabled);
			}
		}

		if (captionPosition !== undefined) {
			internals.captionPosition = captionPosition;

			for (const listener of onCaptionPositionUpdateListeners) {
				listener(internals.captionPosition);
			}
		}
	};

	const configPort: CaptionConfigPort = {
		get captionEnabled() {
			return internals.captionEnabled;
		},

		get captionPosition() {
			return internals.captionPosition;
		},

		updateCaption(params) {
			updateState(params);
		},

		onChangeCaptionEnabled(callback) {
			onChangeCaptionEnabledListeners.add(callback);
			return () => onChangeCaptionEnabledListeners.delete(callback);
		},

		onChangeCaptionPosition(callback) {
			onChangeCaptionPositionListeners.add(callback);
			return () => onChangeCaptionPositionListeners.delete(callback);
		},
	};

	const publicPort: CaptionPublicPort = {
		get captionEnabled() {
			return internals.captionEnabled;
		},

		get captionPosition() {
			return internals.captionPosition;
		},

		onCaptionEnabledUpdate(callback) {
			onCaptionEnabledUpdateListeners.add(callback);
			return () => onCaptionEnabledUpdateListeners.delete(callback);
		},

		onCaptionPositionUpdate(callback) {
			onCaptionPositionUpdateListeners.add(callback);
			return () => onCaptionPositionUpdateListeners.delete(callback);
		},

		changeCaptionEnabled(enabled) {
			for (const listener of onChangeCaptionEnabledListeners) {
				listener(enabled);
			}
		},

		changeCaptionPosition(position) {
			for (const listener of onChangeCaptionPositionListeners) {
				listener(position);
			}
		},
	};

	return { configPort, publicPort };
};
