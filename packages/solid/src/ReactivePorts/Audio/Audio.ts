import type { AudioPublicPort } from "@rangex/editor/audio";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveAudioPort } from "./Audio-types";

export const Audio = <T extends AudioPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveAudioPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveAudioPort>;
	}

	const [captionEnabled, setCaptionEnabled] = createSignal(
		publicPort.captionEnabled,
	);
	const [captionPosition, setCaptionPosition] = createSignal(
		publicPort.captionPosition,
	);
	const [align, setAlign] = createSignal(publicPort.align);
	const [domAttrs, setDOMAttrs] = createSignal(publicPort.domAttrs);
	const [currentComponent, setCurrentComponent] = createSignal(
		publicPort.currentComponent,
	);
	const [isSelectionActive, setIsSelectionActive] = createSignal(
		publicPort.isSelectionActive,
	);

	onCleanup(publicPort.onCaptionEnabledUpdate(setCaptionEnabled));
	onCleanup(publicPort.onCaptionPositionUpdate(setCaptionPosition));
	onCleanup(publicPort.onAlignUpdate(setAlign));
	onCleanup(publicPort.onDOMAttrsUpdate(setDOMAttrs));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentComponent));
	onCleanup(publicPort.onIsSelectionActiveUpdate(setIsSelectionActive));

	const port: ReactiveAudioPort = {
		captionEnabled,
		captionPosition,
		align,
		domAttrs,
		currentComponent,
		isSelectionActive,
	};

	return port as PreserveUndefined<T, ReactiveAudioPort>;
};
