import { createContentLine } from "rich-text-area";
import { createMention } from "../../_Utilities";
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
 * strips the @query text first, then re-reads the cursor position and inserts the component
 * there. Returns a cleanup function.
 */
export const handleMentionSelect = ({
	configPort,
	editorAPI,
}: HandleMentionSelectParams) => {
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onSelect(({ userId, displayName }) => {
		const { queryFound } = removeMentionQueryText({ editorAPI });

		if (!queryFound) {
			console.warn(
				"handleMentionSelect: no @query found at cursor — mention was selected but the trigger text could not be located.",
			);
			return;
		}

		const { fromText, fromOffset } = selection.getBoundaryPoints();

		const mention = createMention({ userId, displayName });

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
