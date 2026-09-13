import type { VideoPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveVideoPort } from "./Video-types";

export const Video = <T extends VideoPublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
	}

	const [quickActionsOpen, setQuickActionsOpen] = createSignal(
		publicPort.quickActionsOpen,
	);
	const [caption, setCaption] = createSignal(publicPort.caption);
	const [align, setAlign] = createSignal(publicPort.align);
	const [currentBlock, setCurrentBlock] = createSignal(
		publicPort.currentComponent,
	);

	onCleanup(publicPort.onQuickActionsOpenUpdate(setQuickActionsOpen));
	onCleanup(publicPort.onCaptionUpdate(setCaption));
	onCleanup(publicPort.onAlignUpdate(setAlign));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentBlock));

	const port: ReactiveVideoPort = {
		quickActionsEl: publicPort.quickActionsEl,
		canSwap: publicPort.canSwap,

		quickActionsOpen,
		caption,
		align,
		currentBlock,

		changeCaptionEnabled: publicPort.changeCaptionEnabled,
		changeCaptionPosition: publicPort.changeCaptionPosition,
		changeAlign: publicPort.changeAlign,
		commitSnapshot: publicPort.commitSnapshot,
		swap: publicPort.swap,
	};

	return port as FromPublicToReactivePort<T>;
};
