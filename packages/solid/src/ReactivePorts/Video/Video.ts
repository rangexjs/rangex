import type { VideoPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type { ReactiveVideoPort, ReactiveVideoResult } from "./Video-types";

export const Video = (publicPort: VideoPublicPort): ReactiveVideoResult => {
	const [isOpen, setIsOpen] = createSignal(publicPort.isOpen);
	const [caption, setCaption] = createSignal(publicPort.caption);
	const [align, setAlign] = createSignal(publicPort.align);
	const [currentBlock, setCurrentBlock] = createSignal(publicPort.currentBlock);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onIsOpenUpdate(setIsOpen));
	unsubscribeList.add(publicPort.onCaptionUpdate(setCaption));
	unsubscribeList.add(publicPort.onAlignUpdate(setAlign));
	unsubscribeList.add(publicPort.onCurrentBlockUpdate(setCurrentBlock));

	const port: ReactiveVideoPort = {
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
