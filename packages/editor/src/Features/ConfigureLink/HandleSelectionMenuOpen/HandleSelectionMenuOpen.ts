import { positionToSelection } from "#engine-links";
import { assertNever } from "#utilities";

import { getLinkPlacementMode } from "../_Utilities";
import type {
	HandleSelectionMenuOpenParams,
	OpenAtCaretParams,
	OpenForWrapParams,
} from "./HandleSelectionMenuOpen-types";

/*
 * Opens the popover anchored to the caret, for a collapsed selection with no range to
 * position against.
 */
const openAtCaret = ({ editorAPI, selectionMenuPopoverController }: OpenAtCaretParams) => {
	positionToSelection({
		editorAPI,
		controller: selectionMenuPopoverController,
		topMargin: 8,
	});
};

/*
 * Opens the popover positioned to a non-collapsed selection, with pre-filled display text.
 */
const openForWrap = ({ editorAPI, selectionMenuPopoverController }: OpenForWrapParams) => {
	positionToSelection({
		editorAPI,
		controller: selectionMenuPopoverController,
		topMargin: 10,
	});
};

/*
 * Opens the selection menu popover when requested, anchoring it to the caret or to the
 * selection depending on the current link placement mode. Returns a cleanup function.
 */
export const handleSelectionMenuOpen = ({
	configPort,
	editorAPI,
	selectionMenuPopoverController,
}: HandleSelectionMenuOpenParams) => {
	const unsubscribe = configPort.onOpen(() => {
		const mode = getLinkPlacementMode({ editorAPI });

		if (!mode) {
			console.warn("handleSelectionMenuOpen: selection can't take a link.");
			return;
		}

		if (mode.type === "insert") {
			openAtCaret({ editorAPI, selectionMenuPopoverController });
			return;
		}

		if (mode.type === "wrap") {
			openForWrap({ editorAPI, selectionMenuPopoverController });
			return;
		}

		assertNever(mode);
	});

	return () => {
		unsubscribe();
	};
};
