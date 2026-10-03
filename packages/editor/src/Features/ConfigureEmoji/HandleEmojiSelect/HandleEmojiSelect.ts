import { createContentLine, createFormattableTexts } from "@rangex/core";
import { getEmojiQuery } from "../_Utilities";
import type {
	HandleEmojiSelectParams,
	RemoveEmojiQueryTextParams,
	RemoveEmojiQueryTextResult,
} from "./HandleEmojiSelect-types";

/*
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

/*
 * Subscribes to emoji selection and inserts the chosen emoji at the cursor, first stripping the
 * :query text that triggered it and re-reading the cursor position before inserting.
 */
export const handleEmojiSelect = ({
	configPort,
	editorAPI,
}: HandleEmojiSelectParams) => {
	const selection = editorAPI.getEditorSelection();

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = configPort.onSelect(({ emoji }) => {
		const { queryFound } = removeEmojiQueryText({ editorAPI });

		if (!queryFound) {
			console.warn(
				"handleEmojiSelect: no :query found at cursor — emoji was selected but the trigger text could not be located.",
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
