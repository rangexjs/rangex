import type { EmbedPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromPublicToReactivePort,
	ReactiveQuickActionsPort,
} from "../../_Utilities";
import type { ReactiveEmbedPort } from "./Embed-types";

export const Embed = <T extends EmbedPublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
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

	const port: ReactiveEmbedPort = {
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

	return port as FromPublicToReactivePort<T>;
};
