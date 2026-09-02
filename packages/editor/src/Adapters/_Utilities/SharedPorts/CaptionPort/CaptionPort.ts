import type {
	CaptionConfigPort,
	CaptionInternals,
	CaptionPublicPort,
	CreateCaptionPortResult,
	OnCaptionEnabledChangeCallbackFn,
	OnCaptionPositionChangeCallbackFn,
	OnCaptionUpdateCallbackFn,
	UpdateStateParams,
} from "./CaptionPort-types";

export const createCaptionPort = (): CreateCaptionPortResult => {
	const internals: CaptionInternals = {
		caption: { enabled: false, position: "below" },
	};

	// ConfigPort
	const onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeCallbackFn> =
		new Set();
	const onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeCallbackFn> =
		new Set();

	// PublicPort
	const onCaptionUpdateListeners: Set<OnCaptionUpdateCallbackFn> = new Set();

	const updateState = ({ caption }: UpdateStateParams) => {
		if (caption !== undefined) {
			internals.caption = caption;

			for (const listener of onCaptionUpdateListeners) {
				listener(internals.caption);
			}
		}
	};

	const configPort: CaptionConfigPort = {
		setCaption(caption) {
			updateState({ caption });
		},

		onCaptionEnabledChange(callback) {
			onCaptionEnabledChangeListeners.add(callback);
			return () => onCaptionEnabledChangeListeners.delete(callback);
		},

		onCaptionPositionChange(callback) {
			onCaptionPositionChangeListeners.add(callback);
			return () => onCaptionPositionChangeListeners.delete(callback);
		},
	};

	const publicPort: CaptionPublicPort = {
		get caption() {
			return internals.caption;
		},

		onCaptionUpdate(callback) {
			onCaptionUpdateListeners.add(callback);
			return () => onCaptionUpdateListeners.delete(callback);
		},

		changeCaptionEnabled(enabled) {
			for (const listener of onCaptionEnabledChangeListeners) {
				listener(enabled);
			}
		},

		changeCaptionPosition(position) {
			for (const listener of onCaptionPositionChangeListeners) {
				listener(position);
			}
		},
	};

	return { configPort, publicPort };
};
