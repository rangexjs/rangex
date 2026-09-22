import { createEmitter } from "../../CreateEmitter";
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
	const captionEnabledUpdateEmitter =
		createEmitter<OnCaptionEnabledUpdateCallbackFn>();
	const captionPositionUpdateEmitter =
		createEmitter<OnCaptionPositionUpdateCallbackFn>();

	// CommandListeners
	const changeCaptionEnabledEmitter =
		createEmitter<OnChangeCaptionEnabledCallbackFn>();
	const changeCaptionPositionEmitter =
		createEmitter<OnChangeCaptionPositionCallbackFn>();

	const updateState = ({
		captionEnabled,
		captionPosition,
	}: UpdateStateParams) => {
		if (captionEnabled !== undefined) {
			internals.captionEnabled = captionEnabled;

			captionEnabledUpdateEmitter.emit(internals.captionEnabled);
		}

		if (captionPosition !== undefined) {
			internals.captionPosition = captionPosition;

			captionPositionUpdateEmitter.emit(internals.captionPosition);
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
			return changeCaptionEnabledEmitter.subscribe(callback);
		},

		onChangeCaptionPosition(callback) {
			return changeCaptionPositionEmitter.subscribe(callback);
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
			return captionEnabledUpdateEmitter.subscribe(callback);
		},

		onCaptionPositionUpdate(callback) {
			return captionPositionUpdateEmitter.subscribe(callback);
		},

		changeCaptionEnabled(enabled) {
			changeCaptionEnabledEmitter.emit(enabled);
		},

		changeCaptionPosition(position) {
			changeCaptionPositionEmitter.emit(position);
		},
	};

	return { configPort, publicPort };
};
