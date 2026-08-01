import type { Line } from "rich-text-area";
import type {
	HandleLineHoverParams,
	HandleLineHoverResult,
} from "./HandleLineHover-types";

/**
 * Tracks which top-level `Line` the pointer is currently over, keeping the popover anchored
 * to it. Only `RootEditable`'s direct children qualify — a `Line` nested inside a
 * `BlockNestedContext` (e.g. a collapsible's content) never gets one.
 *
 * The popover is mounted outside `RootEditable`'s own DOM subtree (a top-layer popover in the
 * shared overlay container), so even though it's positioned to visually sit inside
 * `RootEditable`'s padding, moving the pointer onto it still fires `RootEditable`'s
 * `pointerleave` natively — CSS position never enters into it, only DOM containment does.
 * Hiding therefore mirrors {@link createOverlayAppearanceHandler}: leaving a line schedules a
 * short delayed hide instead of hiding immediately, and the popover itself is tracked via
 * `pointerOver` too — entering it cancels the pending hide, so moving from the line onto the
 * popover never closes it. If a nested popover (e.g. the drag-handle's Delete/Duplicate menu)
 * is still open when the delayed hide fires, it's left alone — checked via `:popover-open`
 * directly on the DOM rather than through any port, since the adapter has no notion of nested
 * popovers. Relocating to a *different* line on `pointerenter` always takes over immediately,
 * closing whatever's open, no delay.
 */
export const handleLineHover = ({
	editorPort,
	editorAPI,
}: HandleLineHoverParams): HandleLineHoverResult => {
	const { element: popover } = editorPort.popover;
	const { rootEditable } = editorAPI;

	let currentLine: Line | null = null;
	let pointerOver = false;
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
			if (popover.querySelector(":popover-open")) {
				return;
			}

			currentLine = null;
			popover.hidePopover();
		}, 100);
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
				const { clientX, clientY } = event;

				const caretPosition = document.caretPositionFromPoint(
					clientX,
					clientY,
					{
						shadowRoots: [editorAPI.shadowRoot],
					},
				);

				if (!caretPosition) {
					scheduleHide();
					return;
				}

				const { offsetNode } = caretPosition;

				const line = rootEditable.$$childNodes.find((line) =>
					line.contains(offsetNode),
				);

				if (!line) {
					scheduleHide();
					return;
				}

				pointerOver = true;
				cancelHide();

				if (currentLine === line) {
					return;
				}

				currentLine = line;

				popover.hidePopover();
				popover.showPopover({ source: currentLine });
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

	const popoverAbortController = new AbortController();

	popover.addEventListener(
		"pointerenter",
		() => {
			pointerOver = true;
			cancelHide();
		},
		{ signal: popoverAbortController.signal },
	);

	popover.addEventListener(
		"pointerleave",
		() => {
			pointerOver = false;
			scheduleHide();
		},
		{ signal: popoverAbortController.signal },
	);

	return {
		getCurrentLine: () => currentLine,
		cleanup: () => {
			unsubscribeEnter();
			unsubscribeMove();
			unsubscribeLeave();
			popoverAbortController.abort();
			cancelHide();
		},
	};
};
