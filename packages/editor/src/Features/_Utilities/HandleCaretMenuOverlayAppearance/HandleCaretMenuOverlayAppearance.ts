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

/**
 * Shared caret-anchored menu wiring for every backtrack-triggered popover (TemplateVariable,
 * Mention, Emoji, CommandMenu, ...): creates the anchored overlay controller over
 * `port.caretMenuEl`, wires all three close behaviors (selection-change, editor blur, Escape —
 * subscribed before appearance, so a close always resolves before appearance re-evaluates on the
 * same selection-change event), and shows the menu whenever `getQuery` finds a trigger at the
 * cursor and `onQuery` says there's something to show. `getQuery` is the only per-feature hook —
 * the backtrack scan itself (which trigger character, how far back to look, any extra
 * validation) is left entirely to the caller.
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
			onToggle: (open) => port.setCaretMenu({ open }),
		},
	});

	const restoreFocusOnEscape = (event: KeyboardEvent) => {
		if (event.key !== "Escape") {
			return;
		}

		if (!anchorController.isOpen) {
			return;
		}

		anchorController.hide();

		editorAPI.focus();
	};

	document.addEventListener("keydown", restoreFocusOnEscape);

	const unsubscribeSelectionChangeClose = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			if (!anchorController.isOpen) {
				return;
			}

			anchorController.hide();
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

			anchorController.hide();
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
	};
};
