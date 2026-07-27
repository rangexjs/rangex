import { getEmbedFigure } from "../_Utilities";
import type { HandleEmbedSwapPopoverToggleParams } from "./HandleEmbedSwapPopoverToggle-types";

/**
 * Wires the popover's Swap button — a native `command="toggle-popover"` invoker — to
 * the engine. The browser's default invoke action is intercepted through the cancelable
 * `command` event so the popover can instead be opened with `showPopover({ source })`,
 * anchoring it to the current embed figure. Plain CSS anchor positioning (`anchor-name`/
 * `position-anchor`) can't be used here since the popover and the figure live in different
 * shadow trees; `source` is the one anchoring mechanism that already crosses that boundary.
 *
 * This `command`-event interception is a temporary workaround, not a permanent design
 * choice: per spec, `anchor-name`/`position-anchor` are supposed to work across shadow
 * trees too — browsers just don't implement that part yet. Once cross-root anchoring lands,
 * this can likely go back to a plain declarative `command="toggle-popover"` button with no
 * interception at all, anchored via CSS instead of `source`.
 *
 * `internals.currentEmbedFigure` is set on open and cleared on close, since the swap
 * popover — despite being nested in the popover's markup — is its own top-layer popover
 * and isn't reachable through {@link OverlayAppearanceHandler}'s hover-driven current-block
 * tracking.
 */
export const handleEmbedSwapPopoverToggle = ({
	editorPort,
	getCurrentBlock,
	internals,
}: HandleEmbedSwapPopoverToggleParams) => {
	const { element: swapPopover } = editorPort.swapPopover;

	const onCommand = (event: Event) => {
		if (
			!(event instanceof CommandEvent) ||
			event.command !== "toggle-popover"
		) {
			return;
		}

		event.preventDefault();

		if (swapPopover.matches(":popover-open")) {
			swapPopover.hidePopover();
			return;
		}

		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const figure = getEmbedFigure({ blockNestedContext: currentBlock });

		internals.currentEmbedFigure = figure;

		swapPopover.style.positionArea = "center";
		swapPopover.showPopover({ source: figure });
	};

	const onToggle = (event: ToggleEvent) => {
		if (event.newState === "open") {
			return;
		}

		internals.currentEmbedFigure = null;
	};

	swapPopover.addEventListener("command", onCommand);
	swapPopover.addEventListener("toggle", onToggle);

	return () => {
		swapPopover.removeEventListener("command", onCommand);
		swapPopover.removeEventListener("toggle", onToggle);
	};
};
