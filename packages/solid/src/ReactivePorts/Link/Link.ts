import type { LinkPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type { ReactiveLinkPort, ReactiveLinkResult } from "./Link-types";

export const Link = (publicPort: LinkPublicPort): ReactiveLinkResult => {
	const [canApply, setCanApply] = createSignal(publicPort.canApply);
	const [view, setView] = createSignal(publicPort.view);
	const [mode, setMode] = createSignal(publicPort.mode);
	const [displayText, setDisplayText] = createSignal(publicPort.displayText);
	const [url, setUrl] = createSignal(publicPort.url);
	const [toggleButtons, setToggleButtons] = createSignal(
		publicPort.toggleButtons,
	);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onCanApplyUpdate(setCanApply));
	unsubscribeList.add(publicPort.onViewUpdate(setView));
	unsubscribeList.add(publicPort.onModeUpdate(setMode));
	unsubscribeList.add(publicPort.onDisplayTextUpdate(setDisplayText));
	unsubscribeList.add(publicPort.onUrlUpdate(setUrl));
	unsubscribeList.add(publicPort.onToggleButtonsUpdate(setToggleButtons));

	const port: ReactiveLinkPort = {
		overlayEl: publicPort.overlayEl,

		canApply,
		view,
		mode,
		displayText,
		url,
		toggleButtons,

		toolbarClick: publicPort.toolbarClick,
		viewChange: publicPort.viewChange,
		cancel: publicPort.cancel,
		insert: publicPort.insert,
		modify: publicPort.modify,
		unwrap: publicPort.unwrap,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
