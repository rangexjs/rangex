import type { ImagePublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	PreserveUndefined,
	ReactiveQuickActionsPort,
} from "../../_Utilities";
import type { ReactiveImagePort } from "./Image-types";

export const Image = <T extends ImagePublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveImagePort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveImagePort>;
	}

	const [quickActionsIsOpen, setQuickActionsIsOpen] = createSignal(
		publicPort.quickActions.isOpen,
	);
	const [captionEnabled, setCaptionEnabled] = createSignal(
		publicPort.captionEnabled,
	);
	const [captionPosition, setCaptionPosition] = createSignal(
		publicPort.captionPosition,
	);
	const [align, setAlign] = createSignal(publicPort.align);
	const [currentBlock, setCurrentBlock] = createSignal(
		publicPort.currentComponent,
	);

	onCleanup(
		publicPort.quickActions.onToggle(() =>
			setQuickActionsIsOpen(publicPort.quickActions.isOpen),
		),
	);
	onCleanup(publicPort.onCaptionEnabledUpdate(setCaptionEnabled));
	onCleanup(publicPort.onCaptionPositionUpdate(setCaptionPosition));
	onCleanup(publicPort.onAlignUpdate(setAlign));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentBlock));

	const quickActions: ReactiveQuickActionsPort = {
		element: publicPort.quickActions.element,
		isOpen: quickActionsIsOpen,
	};

	const port: ReactiveImagePort = {
		quickActions,
		canSwap: publicPort.canSwap,

		captionEnabled,
		captionPosition,
		align,
		currentBlock,

		changeCaptionEnabled: publicPort.changeCaptionEnabled,
		changeCaptionPosition: publicPort.changeCaptionPosition,
		changeAlign: publicPort.changeAlign,
		commitSnapshot: publicPort.commitSnapshot,
		swap: publicPort.swap,
	};

	return port as PreserveUndefined<T, ReactiveImagePort>;
};
