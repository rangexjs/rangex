import { createContentLine } from "@rangex/core";
import { createMention, validateMentionPlacement } from "../../_Utilities";
import { getMentionQuery } from "../_Utilities";
import type {
	HandleMentionSelectParams,
	RemoveMentionQueryTextParams,
	RemoveMentionQueryTextResult,
} from "./HandleMentionSelect-types";

/*
 * Removes the @query text that triggered the mention, before the component is inserted.
 */
const removeMentionQueryText = ({
	editorAPI,
}: RemoveMentionQueryTextParams): RemoveMentionQueryTextResult => {
	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset } = selection.getBoundaryPoints();

	const mentionQuery = getMentionQuery({ editorAPI, fromText, fromOffset });

	if (!mentionQuery) {
		return { queryFound: false };
	}

	const { toText, toOffset } = mentionQuery;

	editorAPI.removeNodesInRange({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	return { queryFound: true };
};

/*
 * Subscribes to mention selection and inserts the mention component at the cursor. On select,
 * validates the params, so an invalid mention leaves the @query text as it is, strips the @query
 * text, then re-reads the cursor position and inserts the component there. Returns a cleanup
 * function.
 */
export const handleMentionSelect = ({
	configPort,
	editorAPI,
}: HandleMentionSelectParams) => {
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onSelect(({ userId, displayText }) => {
		const placementMismatch = validateMentionPlacement({ userId, displayText });

		if (placementMismatch) {
			console.warn(placementMismatch);
			return;
		}

		const { queryFound } = removeMentionQueryText({ editorAPI });

		if (!queryFound) {
			console.warn(
				"handleMentionSelect: no @query found at cursor — mention was selected but the trigger text could not be located.",
			);
			return;
		}

		const { fromText, fromOffset } = selection.getBoundaryPoints();

		const mention = createMention({ userId, displayText });

		editorAPI.insertNode({
			fromNode: fromText,
			fromOffset,
			lines: [createContentLine({ localName: "p", childNodes: [mention] })],
			breakBeforeInsert: false,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
