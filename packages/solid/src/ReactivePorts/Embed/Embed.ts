import type { EmbedPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveEmbedPort } from "./Embed-types";

export const Embed = <T extends EmbedPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveEmbedPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveEmbedPort>;
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

	const port: ReactiveEmbedPort = {
		captionEnabled,
		captionPosition,
		align,
		currentComponent,
	};

	return port as PreserveUndefined<T, ReactiveEmbedPort>;
};
