import type { Line } from "rich-text-area";
import { createAnchoredOverlayController } from "../../../_Utilities";
import type {
	CollectShadowRootsParams,
	CollectShadowRootsResult,
	FindLineAtPointParams,
	FindLineAtPointResult,
	HandleLineHoverParams,
	HandleLineHoverResult,
	IsPointInsideElementParams,
	IsPointInsideElementResult,
} from "./HandleLineHover-types";

/**
 * Collects ShadowRoots upwards from {@link editorAPI}'s ShadowRoot.
 */
const collectShadowRoots = ({
	editorAPI,
}: CollectShadowRootsParams): CollectShadowRootsResult => {
	const shadowRoots: ShadowRoot[] = [];

	let current = editorAPI.shadowRoot;

	while (true) {
		shadowRoots.push(current);

		const root = current.host.getRootNode();

		if (root instanceof ShadowRoot) {
			current = root;
			continue;
		}

		break;
	}

	return shadowRoots;
};

/**
 * Whether the point's underlying node (via `caretPositionFromPoint`, piercing shadow roots) falls
 * inside {@link element}.
 */
const isPointInsideElement = ({
	editorAPI,
	element,
	clientX,
	clientY,
}: IsPointInsideElementParams): IsPointInsideElementResult => {
	const shadowRoots = collectShadowRoots({ editorAPI });

	const caretPosition = document.caretPositionFromPoint(clientX, clientY, {
		shadowRoots,
	});

	if (!caretPosition) {
		return false;
	}

	return element.contains(caretPosition.offsetNode);
};

/**
 * Finds the Line based on clientX/clientY.
 */
const findLineAtPoint = ({
	editorAPI,
	clientX,
	clientY,
}: FindLineAtPointParams): FindLineAtPointResult => {
	const { shadowRoot, rootEditable } = editorAPI;
	const rangeXHost = shadowRoot.host;

	const shadowRoots = collectShadowRoots({ editorAPI });

	const caretPosition = document.caretPositionFromPoint(clientX, clientY, {
		shadowRoots,
	});

	if (!caretPosition) {
		return null;
	}

	const { offsetNode } = caretPosition;

	const line = rootEditable.$$childNodes.find((line) =>
		line.contains(offsetNode),
	);

	if (line) {
		return line;
	}

	const slottedElement = [...rangeXHost.children].find((child) =>
		child.contains(offsetNode),
	);

	const assignedSlot = slottedElement?.assignedSlot;

	if (!assignedSlot) {
		return null;
	}

	const assignedLine = rootEditable.$$childNodes.find((line) =>
		line.contains(assignedSlot),
	);

	return assignedLine ?? null;
};

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
	const overlayController = createAnchoredOverlayController({
		element: anchoredOverlay,
	});

	let currentLine: Line | null = null;
	let lastPointerPosition: { clientX: number; clientY: number } | null = null;
	let hideTimeoutId: ReturnType<typeof setTimeout>;

	const cancelHide = () => {
		clearTimeout(hideTimeoutId);
	};

	const scheduleHide = () => {
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
		const line = findLineAtPoint({ editorAPI, clientX, clientY });
		const hasOpenPopover =
			anchoredOverlay.querySelector(":popover-open") !== null;

		if (line && currentLine !== line && !hasOpenPopover) {
			relocateTo(line);
		}

		const insideRootEditable = line !== null;
		const insideLineHandler = isPointInsideElement({
			editorAPI,
			element: anchoredOverlay,
			clientX,
			clientY,
		});

		const keepOpen = insideRootEditable || insideLineHandler || hasOpenPopover;

		if (keepOpen) {
			cancelHide();
		} else {
			scheduleHide();
		}
	};

	const abortController = new AbortController();
	const { signal } = abortController;

	const watchPopoverClose = () => {
		anchoredOverlay.addEventListener(
			"toggle",
			(event) => {
				if (!(event instanceof ToggleEvent) || event.newState !== "closed") {
					return;
				}

				if (!lastPointerPosition) {
					return;
				}

				updateLineAtPoint(
					lastPointerPosition.clientX,
					lastPointerPosition.clientY,
				);
			},
			{ capture: true, signal },
		);
	};

	watchPopoverClose();

	document.addEventListener(
		"pointermove",
		(event) => {
			const { clientX, clientY } = event;

			lastPointerPosition = { clientX, clientY };

			updateLineAtPoint(clientX, clientY);
		},
		{ capture: true, signal },
	);

	const onScroll = () => {
		if (!lastPointerPosition) {
			return;
		}

		updateLineAtPoint(lastPointerPosition.clientX, lastPointerPosition.clientY);
	};

	const shadowRoots = collectShadowRoots({ editorAPI });

	const roots = [document, ...shadowRoots];

	for (const root of roots) {
		root.addEventListener("scroll", onScroll, { capture: true, signal });
	}

	return {
		getCurrentLine: () => currentLine,
		cleanup: () => {
			abortController.abort();
			cancelHide();
		},
	};
};
