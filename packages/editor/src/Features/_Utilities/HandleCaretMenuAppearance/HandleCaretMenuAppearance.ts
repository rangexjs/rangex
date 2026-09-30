import {
	EditorRange,
	editorSelectionChangeEventType,
	selectionOutEventType,
} from "@rangex/core";
import {
	createAnchoredOverlayController,
	positionToSelection,
} from "#engine-links";
import type { HandleCaretMenuAppearanceParams } from "./HandleCaretMenuAppearance-types";

/*
 * Wires a caret-anchored overlay's appearance to the engine: on selection change, pushes the query `getQuery` finds
 * at the caret and shows the overlay near the cursor, or hides it when there's none. Also closes on editor blur or
 * Escape. Any close resets the query to null, so the query is non-null exactly while the overlay is open.
 */
export const handleCaretMenuAppearance = ({
	port,
	editorAPI,
	getQuery,
}: HandleCaretMenuAppearanceParams) => {
	const selection = editorAPI.getEditorSelection();

	const anchorController = createAnchoredOverlayController({
		element: port.element,
		options: {
			lightDismiss: false,
			closeOnEscape: true,
			onToggle(isOpen) {
				if (isOpen) {
					return;
				}

				port.updateCaretMenu({ query: null });
			},
			onEscape() {
				editorAPI.focus();
			},
		},
	});

	const unsubscribeEditorBlurClose = editorAPI.subscribeEditorEvent({
		type: selectionOutEventType,
		callback: () => {
			if (!anchorController.isOpen) {
				return;
			}

			const { element } = anchorController;
			const root = element.getRootNode();

			if (!(root instanceof ShadowRoot || root instanceof Document)) {
				throw new Error("Overlay root is not a ShadowRoot nor Document.");
			}

			if (element.contains(root.activeElement)) {
				return;
			}

			anchorController.hide({});
		},
	});

	const unsubscribeAppearance = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const { fromText, fromOffset, toText, toOffset } =
				selection.getBoundaryPoints();

			const range = new EditorRange({
				fromNode: fromText,
				fromOffset,
				toNode: toText,
				toOffset,
			});

			const result = (() => {
				// Caret menus only trigger from a collapsed cursor, not a range selection
				if (!range.isSinglePoint) {
					return null;
				}

				const { startText, startOffset } = range;

				return getQuery({
					editorAPI,
					fromText: startText,
					fromOffset: startOffset,
				});
			})();

			const query = result ? result.query : null;

			port.updateCaretMenu({ query });

			if (!result) {
				if (anchorController.isOpen) {
					anchorController.hide({});
				}

				return;
			}

			positionToSelection({
				editorAPI,
				controller: anchorController,
				topMargin: 8,
			});
		},
	});

	return () => {
		unsubscribeEditorBlurClose();
		unsubscribeAppearance();
		anchorController.cleanup();
	};
};
