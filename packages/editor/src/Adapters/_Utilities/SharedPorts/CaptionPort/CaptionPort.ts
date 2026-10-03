import { createEmitter } from "../../CreateEmitter";
import { createStateEmitter } from "../../CreateStateEmitter";
import type {
	CaptionConfigPort,
	CaptionPosition,
	CaptionPublicPort,
	CreateCaptionPortResult,
	OnChangeCaptionEnabledCallbackFn,
	OnChangeCaptionPositionCallbackFn,
	UpdateStateParams,
} from "./CaptionPort-types";

export const createCaptionPort = (): CreateCaptionPortResult => {
	// States
	const captionEnabledState = createStateEmitter<boolean>(false);
	const captionPositionState = createStateEmitter<CaptionPosition>("below");

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
			captionEnabledState.set(captionEnabled);
		}

		if (captionPosition !== undefined) {
			captionPositionState.set(captionPosition);
		}
	};

	const configPort: CaptionConfigPort = {
		get captionEnabled() {
			return captionEnabledState.get();
		},

		get captionPosition() {
			return captionPositionState.get();
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
			return captionEnabledState.get();
		},

		get captionPosition() {
			return captionPositionState.get();
		},

		onCaptionEnabledUpdate(callback) {
			return captionEnabledState.subscribe(callback);
		},

		onCaptionPositionUpdate(callback) {
			return captionPositionState.subscribe(callback);
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
