import { positionToSelection } from "#engine-links";
import { assertNever } from "#utilities";
import { getLinkInsertionMode } from "../_Utilities";
import type {
	GetDisplayTextInfoParams,
	GetDisplayTextInfoResult,
	HandleLinkToolbarClickParams,
	OpenAtCaretParams,
	OpenForWrapParams,
} from "./HandleLinkToolbarClick-types";

/**
 * Opens the popover anchored to the caret — used when the selection is collapsed, so there is
 * no range to position against.
 */
const openAtCaret = ({
	configPort,
	editorAPI,
	popoverController,
}: OpenAtCaretParams) => {
	// Blur whatever currently has focus so it passes cleanly to the popover.
	if (document.activeElement instanceof HTMLElement) {
		document.activeElement.blur();
	}

	configPort.updateState({
		view: "edit",
		mode: "insert",
		displayText: { inputValue: "", disabled: false },
		url: { inputValue: "" },
		toggleButtons: { isNewTab: false },
	});

	positionToSelection({
		editorAPI,
		controller: popoverController,
		topMargin: 8,
	});
};

/**
 * Pre-fills the display text field from the selection, or disables it when the selection spans
 * more than one wrappable segment (no single plain-text value can represent it).
 */
const getDisplayTextInfo = ({
	editorAPI,
}: GetDisplayTextInfoParams): GetDisplayTextInfoResult => {
	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset, toText, toOffset } =
		selection.getBoundaryPoints();

	const segments = editorAPI.getInlineWrappableSegments({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	if (segments.length === 1) {
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
 * Opens the popover positioned to the selection with pre-filled display text — used when the
 * selection is non-collapsed.
 */
const openForWrap = ({
	configPort,
	editorAPI,
	popoverController,
}: OpenForWrapParams) => {
	if (document.activeElement instanceof HTMLElement) {
		document.activeElement.blur();
	}

	const displayText = getDisplayTextInfo({ editorAPI });

	configPort.updateState({
		view: "edit",
		mode: "insert",
		displayText,
		url: { inputValue: "" },
		toggleButtons: { isNewTab: false },
	});

	positionToSelection({
		editorAPI,
		controller: popoverController,
		topMargin: 10,
	});

	const selection = editorAPI.getEditorSelection();

	// Keep the selection visually highlighted while the popover has taken focus away from it.
	selection.highlight = true;
};

export const handleLinkToolbarClick = ({
	configPort,
	editorAPI,
	popoverController,
}: HandleLinkToolbarClickParams) => {
	const unsubscribe = configPort.onToolbarClick(() => {
		const mode = getLinkInsertionMode({ editorAPI });

		if (!mode) {
			console.warn("handleLinkToolbarClick: selection can't take a link.");
			return;
		}

		if (mode === "insert") {
			openAtCaret({ configPort, editorAPI, popoverController });
			return;
		}

		if (mode === "wrap") {
			openForWrap({ configPort, editorAPI, popoverController });
			return;
		}

		assertNever(mode);
	});

	return () => {
		unsubscribe();
	};
};
