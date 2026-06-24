import {
	createContentLine,
	createFormattableTexts,
	EditorRange,
	type EditorSelectionChangeCallbackFn,
	editorSelectionChangeEventType,
} from "rich-text-area";
import { getEmojiAutoComplete } from "../_Utilities";
import type { HandleEmojiAutoCompleteParams } from "./HandleEmojiAutoComplete-types";

/**
 * Subscribes to selection changes and auto-inserts an emoji when the cursor sits
 * immediately after a completed :<name>: shortcode that exactly matches a known emoji.
 */
export const handleEmojiAutoComplete = ({
	richTextEditorUI,
	editorAPI,
}: HandleEmojiAutoCompleteParams) => {
	const { emojiPopover } = richTextEditorUI;

	const selection = editorAPI.getEditorSelection();

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const callback: EditorSelectionChangeCallbackFn = () => {
		const { fromText, fromOffset, toText, toOffset } =
			selection.getBoundaryPoints();

		const range = new EditorRange({
			fromNode: fromText,
			fromOffset,
			toNode: toText,
			toOffset,
		});

		if (!range.isSinglePoint) {
			return;
		}

		const { startText, startOffset } = range;

		const autoComplete = getEmojiAutoComplete({
			editorAPI,
			fromText: startText,
			fromOffset: startOffset,
		});

		if (!autoComplete) {
			return;
		}

		const match = emojiPopover.findByName(autoComplete.name);

		if (!match) {
			return;
		}

		// Remove the :<name>: trigger text
		editorAPI.removeNodesInRange({
			fromNode: startText,
			fromOffset: startOffset,
			toNode: autoComplete.toText,
			toOffset: autoComplete.toOffset,
		});

		// Re-read cursor after removal, then insert the emoji character
		const { fromText: newFromText, fromOffset: newFromOffset } =
			selection.getBoundaryPoints();

		editorAPI.insertNode({
			fromNode: newFromText,
			fromOffset: newFromOffset,
			lines: [
				createContentLine({
					childNodes: [...createFormattableTexts({ data: match.emoji })],
				}),
			],
			breakBeforeInsert: false,
		});

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	};

	editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback,
	});
};
