import { caretAnchorName } from "rich-text-area";
import { assertNever } from "#ports";
import { positionToSelection } from "../../../_Utilities";
import { getLinkInsertionMode } from "../_Utilities";
import type {
	GetDisplayTextInfoParams,
	GetDisplayTextInfoResult,
	HandleToolbarLinkClickParams,
	OpenAtCaretParams,
	OpenForWrapParams,
	OpenLinkPopoverParams,
} from "./HandleToolbarLinkClick-types";

/**
 * Opens the popover anchored to the caret anchor — used when the selection is collapsed, so there is no range to position against.
 */
const openAtCaret = ({
	editorPort,
	editorAPI,
	anchorController,
}: OpenAtCaretParams) => {
	const { shadowRoot } = editorAPI;

	const caretAnchor = shadowRoot.querySelector(caretAnchorName);

	if (!(caretAnchor instanceof HTMLElement)) {
		throw new Error("CaretAnchor's type is invalid.");
	}

	// Blur the editor before opening the popover so focus passes cleanly to it
	if (document.activeElement instanceof HTMLElement) {
		document.activeElement.blur();
	}

	editorPort.updateState({
		view: "edit",
		mode: "insert",
		displayText: { inputValue: "", disabled: false },
		url: { inputValue: "" },
		toggleButtons: { isNewTab: false },
	});

	anchorController.show(caretAnchor, {
		clear: true,
		position: "absolute",
		"justify-self": "anchor-center",
		top: "calc(anchor(bottom) + 8px)",
	});
};

/**
 * Pre-fills the display text field from the selection, or disables it when the selection spans multiple wrappable segments.
 */
const getDisplayTextInfo = ({
	editorAPI,
}: GetDisplayTextInfoParams): GetDisplayTextInfoResult => {
	const selection = editorAPI.getEditorSelection();
	const { fromText, fromOffset, toText, toOffset } =
		selection.getBoundaryPoints();

	const inlineWrappableSegments = editorAPI.getInlineWrappableSegments({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	if (inlineWrappableSegments.length === 1) {
		const inputValue = editorAPI.getPlainText({
			fromNode: fromText,
			fromOffset,
			toNode: toText,
			toOffset,
		});

		return { inputValue, disabled: false };
	}

	return { inputValue: "Selected Text", disabled: true };
};

/**
 * Opens the popover positioned to the selection with pre-filled display text — used when the selection is non-collapsed.
 */
const openForWrap = ({
	editorPort,
	editorAPI,
	anchorController,
}: OpenForWrapParams) => {
	// Blur the editor before opening the popover so focus passes cleanly to it
	if (document.activeElement instanceof HTMLElement) {
		document.activeElement.blur();
	}

	const displayText = getDisplayTextInfo({ editorAPI });

	editorPort.updateState({
		view: "edit",
		mode: "insert",
		displayText,
		url: { inputValue: "" },
		toggleButtons: { isNewTab: false },
	});

	positionToSelection({
		editorAPI,
		controller: anchorController,
		topMargin: 10,
	});

	const selection = editorAPI.getEditorSelection();

	// Keep the selection visually highlighted while the popover is open, since the editor loses focus
	selection.highlight = true;
};

/**
 * Delegates to openAtCaret or openForWrap based on the insertion mode, or bails if insertion is not allowed.
 */
const openLinkPopover = ({
	editorPort,
	editorAPI,
	anchorController,
}: OpenLinkPopoverParams) => {
	const linkInsertionMode = getLinkInsertionMode({ editorAPI });

	if (!linkInsertionMode) {
		console.warn("Insertion is not allowed.");
		return;
	}

	if (linkInsertionMode === "insert") {
		openAtCaret({ editorPort, editorAPI, anchorController });
		return;
	}

	if (linkInsertionMode === "wrap") {
		openForWrap({ editorPort, editorAPI, anchorController });
		return;
	}

	assertNever(linkInsertionMode);
};

/**
 * Registers the toolbar insert button handler and opens the link popover when the user clicks it.
 */
export const handleToolbarLinkClick = ({
	editorPort,
	editorAPI,
	anchorController,
}: HandleToolbarLinkClickParams) => {
	const unsubscribe = editorPort.onToolbarClick(() => {
		openLinkPopover({ editorPort, editorAPI, anchorController });
	});

	return () => {
		unsubscribe?.();
	};
};
