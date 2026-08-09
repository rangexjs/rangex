import { createContentLine, createFormattableTexts } from "rich-text-area";
import { getEmojiQuery } from "../_Utilities";
import type {
	HandleEmojiInsertionParams,
	RemoveEmojiQueryTextParams,
	RemoveEmojiQueryTextResult,
} from "./HandleEmojiInsertion-types";

/**
 * Removes the :query text (e.g. ":sob") that triggered the emoji, before the emoji is inserted.
 */
const removeEmojiQueryText = ({
	editorAPI,
}: RemoveEmojiQueryTextParams): RemoveEmojiQueryTextResult => {
	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset } = selection.getBoundaryPoints();

	const emojiQuery = getEmojiQuery({
		editorAPI,
		fromText,
		fromOffset,
		hasClosingColon: false,
	});

	if (!emojiQuery) {
		return { queryFound: false };
	}

	const { toText, toOffset } = emojiQuery;

	editorAPI.removeNodesInRange({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	return { queryFound: true };
};

/**
 * Subscribes to emoji selection and inserts the emoji character at the cursor.
 * Strips the :query text first, then re-reads the cursor position and inserts there.
 */
export const handleEmojiInsertion = ({
	editorPort,
	editorAPI,
}: HandleEmojiInsertionParams) => {
	const selection = editorAPI.getEditorSelection();

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = editorPort.onSelect(({ emoji }) => {
		const { queryFound } = removeEmojiQueryText({ editorAPI });

		if (!queryFound) {
			console.warn(
				"handleEmojiInsertion: no :query found at cursor — emoji was selected but the trigger text could not be located.",
			);
			return;
		}

		const { fromText, fromOffset } = selection.getBoundaryPoints();

		editorAPI.insertNode({
			fromNode: fromText,
			fromOffset,
			lines: [
				createContentLine({
					localName: "p",
					childNodes: [...createFormattableTexts({ data: emoji })],
				}),
			],
			breakBeforeInsert: false,
		});

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
