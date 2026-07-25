import {
	createContentLine,
	createFormattableTexts,
	createInlineNestedContext,
	createNestedEditable,
} from "rich-text-area";
import { componentsName } from "../../../Constants";
import { createMentionStorage } from "../../../Storage";
import { getMentionQuery } from "../_Utilities";
import type {
	CreateMentionComponentParams,
	CreateMentionComponentResult,
	HandleMentionInsertionParams,
	RemoveMentionQueryTextParams,
	RemoveMentionQueryTextResult,
} from "./HandleMentionInsertion-types";

/**
 * Removes the @query text (e.g. "@john") that triggered the mention, before the component is inserted.
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

const createMentionComponent = ({
	userId,
	name,
}: CreateMentionComponentParams): CreateMentionComponentResult => {
	const data = `@${name}`;

	const inlineNestedContext = createInlineNestedContext({
		componentName: componentsName.mention,
		content: { type: "custom" },
		customStorage: createMentionStorage({ userId }),
		editState: "false",
		childNodes: [
			createNestedEditable({
				content: { type: "default" },
				display: "inline",
				childNodes: [
					createContentLine({
						localName: "span",
						childNodes: [...createFormattableTexts({ data })],
					}),
				],
			}),
		],
	});

	return inlineNestedContext;
};

/**
 * Subscribes to mention selection and inserts the mention component at the cursor.
 * On select, strips the @query text first, then re-reads the cursor position (now pointing
 * at where the @ was) and inserts the component there.
 */
export const handleMentionInsertion = ({
	editorPort,
	editorAPI,
}: HandleMentionInsertionParams) => {
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = editorPort.onSelect(({ id, name }) => {
		const { queryFound } = removeMentionQueryText({ editorAPI });

		if (!queryFound) {
			console.warn(
				"handleMentionInsertion: no @query found at cursor — mention was selected but the trigger text could not be located.",
			);
			return;
		}

		const { fromText, fromOffset } = selection.getBoundaryPoints();

		const mention = createMentionComponent({ userId: id, name });

		editorAPI.insertNode({
			fromNode: fromText,
			fromOffset,
			lines: [createContentLine({ localName: "p", childNodes: [mention] })],
			breakBeforeInsert: false,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
