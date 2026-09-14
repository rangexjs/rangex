import type { AudioPublicPort } from "@rangex/editor";
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
	const [currentComponent, setCurrentComponent] = createSignal(
		publicPort.currentComponent,
	);

	onCleanup(publicPort.onCaptionEnabledUpdate(setCaptionEnabled));
	onCleanup(publicPort.onCaptionPositionUpdate(setCaptionPosition));
	onCleanup(publicPort.onAlignUpdate(setAlign));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentComponent));

	const port: ReactiveAudioPort = {
		captionEnabled,
		captionPosition,
		align,
		currentComponent,
	};

	return port as PreserveUndefined<T, ReactiveAudioPort>;
};
