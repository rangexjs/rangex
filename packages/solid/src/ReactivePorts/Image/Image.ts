import type { ImagePublicPort } from "@rangex/editor/image";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveImagePort } from "./Image-types";

export const Image = <T extends ImagePublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveImagePort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveImagePort>;
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

	const port: ReactiveImagePort = {
		captionEnabled,
		captionPosition,
		align,
		currentComponent,
		isSelectionActive,
	};

	return port as PreserveUndefined<T, ReactiveImagePort>;
};
