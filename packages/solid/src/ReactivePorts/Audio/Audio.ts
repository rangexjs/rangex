import type { AudioPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveAudioPort } from "./Audio-types";

export const Audio = <T extends AudioPublicPort | undefined>(
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

	const port: ReactiveAudioPort = {
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
