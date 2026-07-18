import {
	createContentLine,
	createFormattableTexts,
	EditorRange,
} from "rich-text-area";
import { getEmojiQuery } from "../_Utilities";
import type { HandleEmojiAutoCompleteParams } from "./HandleEmojiAutoComplete-types";

/**
 * Intercepts the closing ':' keystroke and auto-inserts an emoji when the text
 * immediately before the cursor forms a completed :<name> shortcode that matches
 * a known emoji. Fires only on actual typing, not on cursor movement.
 */
export const handleEmojiAutoComplete = ({
	emojiPort,
	editorAPI,
}: HandleEmojiAutoCompleteParams) => {
	const selection = editorAPI.getEditorSelection();

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unregister = editorAPI.registerEventInterceptor({
		type: "beforeinput",
		interceptor: (event) => {
			if (event.data !== ":") {
				return false;
			}

			const { fromText, fromOffset, toText, toOffset } =
				selection.getBoundaryPoints();

			const range = new EditorRange({
				fromNode: fromText,
				fromOffset,
				toNode: toText,
				toOffset,
			});

			if (!range.isSinglePoint) {
				return false;
			}

			const { startText, startOffset } = range;

			const emojiQuery = getEmojiQuery({
				editorAPI,
				fromText: startText,
				fromOffset: startOffset,
			});

			if (!emojiQuery) {
				return false;
			}

			const match = emojiPort.findByName(emojiQuery.query);

			if (!match) {
				return false;
			}

			// Remove the :<name> trigger text (the closing ':' is prevented from inserting)
			editorAPI.removeNodesInRange({
				fromNode: startText,
				fromOffset: startOffset,
				toNode: emojiQuery.toText,
				toOffset: emojiQuery.toOffset,
			});

			// Re-read cursor after removal, then insert the emoji character
			const { fromText: newFromText, fromOffset: newFromOffset } =
				selection.getBoundaryPoints();

			editorAPI.insertNode({
				fromNode: newFromText,
				fromOffset: newFromOffset,
				lines: [
					createContentLine({
						localName: "p",
						childNodes: [...createFormattableTexts({ data: match.emoji })],
					}),
				],
				breakBeforeInsert: false,
			});

			snapshotTimeline.registerSnapshotBoundary();

			editorAPI.focus();

			return true;
		},
	});

	return () => {
		unregister();
	};
};
