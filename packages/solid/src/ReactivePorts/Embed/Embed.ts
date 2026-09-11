import type { EmbedPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type { ReactiveEmbedPort, ReactiveEmbedResult } from "./Embed-types";

export const Embed = (publicPort: EmbedPublicPort): ReactiveEmbedResult => {
	const [quickActionsOpen, setQuickActionsOpen] = createSignal(
		publicPort.quickActionsOpen,
	);
	const [caption, setCaption] = createSignal(publicPort.caption);
	const [align, setAlign] = createSignal(publicPort.align);
	const [currentBlock, setCurrentBlock] = createSignal(
		publicPort.currentComponent,
	);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onQuickActionsOpenUpdate(setQuickActionsOpen));
	unsubscribeList.add(publicPort.onCaptionUpdate(setCaption));
	unsubscribeList.add(publicPort.onAlignUpdate(setAlign));
	unsubscribeList.add(publicPort.onCurrentComponentUpdate(setCurrentBlock));

	const port: ReactiveEmbedPort = {
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

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
