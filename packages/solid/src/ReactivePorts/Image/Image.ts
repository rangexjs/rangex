import type { ImagePublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type { ReactiveImagePort, ReactiveImageResult } from "./Image-types";

export const Image = (publicPort: ImagePublicPort): ReactiveImageResult => {
	const [isOpen, setIsOpen] = createSignal(publicPort.isOpen);
	const [caption, setCaption] = createSignal(publicPort.caption);
	const [align, setAlign] = createSignal(publicPort.align);
	const [currentBlock, setCurrentBlock] = createSignal(publicPort.currentBlock);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onIsOpenUpdate(setIsOpen));
	unsubscribeList.add(publicPort.onCaptionUpdate(setCaption));
	unsubscribeList.add(publicPort.onAlignUpdate(setAlign));
	unsubscribeList.add(publicPort.onCurrentBlockUpdate(setCurrentBlock));

	const port: ReactiveImagePort = {
		raw: publicPort,

		floatingEl: publicPort.floatingEl,

		isOpen,
		caption,
		align,
		currentBlock,

		changeCaptionEnabled: publicPort.changeCaptionEnabled,
		changeCaptionPosition: publicPort.changeCaptionPosition,
		changeAlign: publicPort.changeAlign,
		commitSnapshot: publicPort.commitSnapshot,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
