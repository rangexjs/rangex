import {
	EditorRange,
	editorSelectionChangeEventType,
	selectionOutEventType,
} from "rich-text-area";
import {
	createAnchoredOverlayController,
	positionToSelection,
} from "#engine-links";
import type { HandleCaretMenuOverlayAppearanceParams } from "./HandleCaretMenuOverlayAppearance-types";

/*
 * Wires a caret-anchored overlay's appearance to the engine: closes it on selection change,
 * editor blur, or Escape, and shows it near the cursor whenever the injected `getQuery` finds
 * a trigger at the caret and `onQuery` confirms there's something to display.
 */
export const handleCaretMenuOverlayAppearance = ({
	port,
	editorAPI,
	getQuery,
	onQuery,
}: HandleCaretMenuOverlayAppearanceParams) => {
	const selection = editorAPI.getEditorSelection();

	const anchorController = createAnchoredOverlayController({
		element: port.caretMenuEl,
		options: {
			lightDismiss: false,
			closeOnEscape: false,
			onToggle: (open) => port.updateCaretMenu({ open }),
		},
	});

	const restoreFocusOnEscape = (event: KeyboardEvent) => {
		if (event.key !== "Escape") {
			return;
		}

		if (!anchorController.isOpen) {
			return;
		}

		anchorController.hide({});

		editorAPI.focus();
	};

	document.addEventListener("keydown", restoreFocusOnEscape);

	const unsubscribeSelectionChangeClose = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			if (!anchorController.isOpen) {
				return;
			}

			anchorController.hide({});
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

			// Caret menus only trigger from a collapsed cursor, not a range selection
			if (!range.isSinglePoint) {
				return;
			}

			const { startText, startOffset } = range;

			const result = getQuery({
				editorAPI,
				fromText: startText,
				fromOffset: startOffset,
			});

			if (!result) {
				return;
			}

			const shouldShow = onQuery(result.query);

			if (!shouldShow) {
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
		document.removeEventListener("keydown", restoreFocusOnEscape);
		unsubscribeSelectionChangeClose();
		unsubscribeEditorBlurClose();
		unsubscribeAppearance();
		anchorController.cleanup();
	};
};
