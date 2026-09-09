import type { EmbedPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type { ReactiveEmbedPort, ReactiveEmbedResult } from "./Embed-types";

export const Embed = (publicPort: EmbedPublicPort): ReactiveEmbedResult => {
	const [isOpen, setIsOpen] = createSignal(publicPort.isOpen);
	const [caption, setCaption] = createSignal(publicPort.caption);
	const [align, setAlign] = createSignal(publicPort.align);
	const [currentBlock, setCurrentBlock] = createSignal(publicPort.currentBlock);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onIsOpenUpdate(setIsOpen));
	unsubscribeList.add(publicPort.onCaptionUpdate(setCaption));
	unsubscribeList.add(publicPort.onAlignUpdate(setAlign));
	unsubscribeList.add(publicPort.onCurrentBlockUpdate(setCurrentBlock));

	const port: ReactiveEmbedPort = {
		floatingEl: publicPort.floatingEl,
		canSwap: publicPort.canSwap,

		isOpen,
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
