import type { Line } from "rich-text-area";
import { createAnchoredOverlayController } from "../../../_Utilities";
import type {
	HandleLineHoverParams,
	HandleLineHoverResult,
} from "./HandleLineHover-types";

/**
 * Tracks which top-level `Line` the pointer is hovering and keeps the line-handler overlay
 * shown and anchored to it — only `RootEditable`'s direct children qualify, so a `Line` nested
 * inside a `BlockComponent` never gets one.
 */
export const handleLineHover = ({
	editorPort,
	editorAPI,
	onLineChange,
}: HandleLineHoverParams): HandleLineHoverResult => {
	const { element: anchoredOverlay } = editorPort.anchoredOverlay;
	const { rootEditable } = editorAPI;
	const overlayController = createAnchoredOverlayController({
		element: anchoredOverlay,
	});

	let currentLine: Line | null = null;
	let pointerOver = false;
	let lastPointerPosition: { clientX: number; clientY: number } | null = null;
	let hideTimeoutId: ReturnType<typeof setTimeout>;

	const cancelHide = () => {
		clearTimeout(hideTimeoutId);
	};

	const scheduleHide = () => {
		if (pointerOver) {
			return;
		}

		cancelHide();

		hideTimeoutId = setTimeout(() => {
			if (anchoredOverlay.querySelector(":popover-open")) {
				return;
			}

			currentLine = null;
			lastPointerPosition = null;
			onLineChange(null);
			overlayController.hide();
		}, 100);
	};

	const registerScrollListeners = (
		element: Element,
		listener: () => void,
		signal: AbortSignal,
	) => {
		let root = element.getRootNode();

		while (true) {
			root.addEventListener("scroll", listener, { capture: true, signal });

			if (!(root instanceof ShadowRoot)) {
				break;
			}

			root = root.host.getRootNode();
		}

		if (root !== document) {
			document.addEventListener("scroll", listener, { capture: true, signal });
		}
	};

	const findLineAtPoint = (clientX: number, clientY: number): Line | null => {
		const caretPosition = document.caretPositionFromPoint(clientX, clientY, {
			shadowRoots: [editorAPI.shadowRoot],
		});

		if (!caretPosition) {
			return null;
		}

		const { offsetNode } = caretPosition;

		const line = rootEditable.$$childNodes.find((line) =>
			line.contains(offsetNode),
		);

		return line ?? null;
	};

	const hideNestedPopovers = () => {
		const openPopovers =
			anchoredOverlay.querySelectorAll<HTMLElement>(":popover-open");

		for (const openPopover of openPopovers) {
			openPopover.hidePopover();
		}
	};

	const relocateTo = (line: Line) => {
		currentLine = line;
		onLineChange(line);

		hideNestedPopovers();

		overlayController.show(line, {
			position: "absolute",
			top: "anchor(top)",
			right: "calc(anchor(left) + 8px)",
		});
	};

	const updateLineAtPoint = (clientX: number, clientY: number) => {
		const line = findLineAtPoint(clientX, clientY);

		if (!line) {
			scheduleHide();
			return;
		}

		pointerOver = true;
		cancelHide();

		if (currentLine === line) {
			return;
		}

		relocateTo(line);
	};

	const unsubscribeEnter = editorAPI.registerDOMEvent({
		when: ({ element }) => element === rootEditable,
		eventListener: {
			type: "pointerenter",
			listener: () => {
				pointerOver = true;
				cancelHide();
			},
		},
	});

	const unsubscribeMove = editorAPI.registerDOMEvent({
		when: ({ element }) => element === rootEditable,
		eventListener: {
			type: "pointermove",
			listener: (event) => {
				lastPointerPosition = {
					clientX: event.clientX,
					clientY: event.clientY,
				};
				updateLineAtPoint(event.clientX, event.clientY);
			},
		},
	});

	const unsubscribeLeave = editorAPI.registerDOMEvent({
		when: ({ element }) => element === rootEditable,
		eventListener: {
			type: "pointerleave",
			listener: () => {
				pointerOver = false;
				scheduleHide();
			},
		},
	});

	const abortController = new AbortController();
	const { signal } = abortController;

	anchoredOverlay.addEventListener(
		"pointerenter",
		() => {
			pointerOver = true;
			cancelHide();
		},
		{ signal },
	);

	anchoredOverlay.addEventListener(
		"pointerleave",
		() => {
			pointerOver = false;
			scheduleHide();
		},
		{ signal },
	);

	const onScroll = () => {
		if (!lastPointerPosition) {
			return;
		}

		updateLineAtPoint(lastPointerPosition.clientX, lastPointerPosition.clientY);
	};

	registerScrollListeners(anchoredOverlay, onScroll, signal);

	return {
		getCurrentLine: () => currentLine,
		cleanup: () => {
			unsubscribeEnter();
			unsubscribeMove();
			unsubscribeLeave();
			abortController.abort();
			cancelHide();
		},
	};
};
