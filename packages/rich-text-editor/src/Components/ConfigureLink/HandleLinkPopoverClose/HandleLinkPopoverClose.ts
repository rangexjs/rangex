import { EditorRange, editorSelectionChangeEventType } from "rich-text-area";
import type {
	CloseOnSelectionChangeParams,
	HandleLinkPopoverCancelParams,
	HandleLinkPopoverCloseParams,
	OnPopoverCloseParams,
	RestoreFocusOnEscapeParams,
} from "./HandleLinkPopoverClose-types";

/**
 * Closes the popover whenever the selection moves outside the current link or becomes non-collapsed.
 */
const closeOnSelectionChange = ({
	linkPopover,
	editorAPI,
	internals,
}: CloseOnSelectionChangeParams) => {
	const { popover } = linkPopover;

	editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			if (!popover.matches(":popover-open")) {
				return;
			}

			const { currentLink } = internals;

			if (!currentLink) {
				popover.hidePopover();
				return;
			}

			const selection = editorAPI.getEditorSelection();

			const { fromText, fromOffset, toText, toOffset } =
				selection.getBoundaryPoints();

			const range = new EditorRange({
				fromNode: fromText,
				fromOffset,
				toNode: toText,
				toOffset,
			});

			const { startText } = range;

			// Keep the popover open only while the caret is collapsed and positioned inside the link
			if (currentLink.contains(startText) && range.isSinglePoint) {
				return;
			}

			popover.hidePopover();
		},
	});
};

/**
 * Closes the popover on cancel only in insert mode — in modify mode the UI handles transitioning back to preview.
 */
const handleLinkPopoverCancel = ({
	linkPopover,
	internals,
}: HandleLinkPopoverCancelParams) => {
	const { popover } = linkPopover;

	linkPopover.onCancel(() => {
		if (internals.currentLink) {
			return;
		}

		popover.hidePopover();
	});
};

/**
 * Returns focus to the editor when the user presses Escape inside the popover.
 */
const restoreFocusOnEscape = ({
	linkPopover,
	editorAPI,
}: RestoreFocusOnEscapeParams) => {
	const { popover } = linkPopover;

	popover.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") {
			return;
		}

		editorAPI.focus();
	});
};

/**
 * Clears currentLink whenever the popover closes, keeping internals consistent regardless of how it was dismissed.
 */
const onPopoverClose = ({
	linkPopover,
	editorAPI,
	internals,
}: OnPopoverCloseParams) => {
	const { popover } = linkPopover;
	const selection = editorAPI.getEditorSelection();

	popover.addEventListener("toggle", (event) => {
		if (event.newState === "open") {
			return;
		}

		selection.highlight = false;
		internals.currentLink = null;
	});
};

/**
 * Wires up all popover close behaviors: selection-driven close, cancel handling, and internals cleanup on toggle.
 */
export const handleLinkPopoverClose = ({
	richTextEditorUI,
	editorAPI,
	internals,
}: HandleLinkPopoverCloseParams) => {
	const { linkPopover } = richTextEditorUI;

	closeOnSelectionChange({ linkPopover, editorAPI, internals });

	handleLinkPopoverCancel({ linkPopover, internals });

	restoreFocusOnEscape({ linkPopover, editorAPI });

	onPopoverClose({ linkPopover, editorAPI, internals });
};
