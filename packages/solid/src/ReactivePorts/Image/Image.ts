import type { ImagePublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveImagePort } from "./Image-types";

export const Image = <T extends ImagePublicPort | undefined>(
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

	const port: ReactiveImagePort = {
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
