import type { VideoPublicPort } from "@rangex/editor/video";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveVideoPort } from "./Video-types";

export const Video = <T extends VideoPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveVideoPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveVideoPort>;
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
	const [isSelectionActive, setIsSelectionActive] = createSignal(
		publicPort.isSelectionActive,
	);

	onCleanup(publicPort.onCaptionEnabledUpdate(setCaptionEnabled));
	onCleanup(publicPort.onCaptionPositionUpdate(setCaptionPosition));
	onCleanup(publicPort.onAlignUpdate(setAlign));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentComponent));
	onCleanup(publicPort.onIsSelectionActiveUpdate(setIsSelectionActive));

	const port: ReactiveVideoPort = {
		captionEnabled,
		captionPosition,
		align,
		currentComponent,
		isSelectionActive,
	};

	return port as PreserveUndefined<T, ReactiveVideoPort>;
};
