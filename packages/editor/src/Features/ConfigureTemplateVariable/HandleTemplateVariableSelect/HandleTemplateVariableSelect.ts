import { createContentLine } from "@rangex/core";
import { ensureNodeRootStorage } from "#storage";
import { createTemplateVariable } from "../../_Utilities";
import {
	getTemplateVariableDisplayText,
	getTemplateVariableQuery,
} from "../_Utilities";
import type {
	HandleTemplateVariableSelectParams,
	RemoveTemplateVariableQueryTextParams,
	RemoveTemplateVariableQueryTextResult,
} from "./HandleTemplateVariableSelect-types";

/*
 * Removes the {{query text that triggered the caret menu, before the component is inserted.
 */
const removeTemplateVariableQueryText = ({
	editorAPI,
}: RemoveTemplateVariableQueryTextParams): RemoveTemplateVariableQueryTextResult => {
	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset } = selection.getBoundaryPoints();

	const templateVariableQuery = getTemplateVariableQuery({
		editorAPI,
		fromText,
		fromOffset,
	});

	if (!templateVariableQuery) {
		return { queryFound: false };
	}

	const { toText, toOffset } = templateVariableQuery;

	editorAPI.removeNodesInRange({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	return { queryFound: true };
};

/*
 * Subscribes to caret-menu selection and inserts the component at the cursor. Strips the
 * {{query text first, then re-reads the cursor position and inserts there. Returns a cleanup
 * function.
 */
export const handleTemplateVariableSelect = ({
	configPort,
	editorAPI,
}: HandleTemplateVariableSelectParams) => {
	const { rootEditable } = editorAPI;

	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onSelect(({ fieldName }) => {
		const rootStorage = ensureNodeRootStorage({ rootEditable });

		const displayText = getTemplateVariableDisplayText({
			fieldName,
			fieldsConfig: configPort.fieldsConfig,
			storage: rootStorage.templateVariable,
		});

		if (displayText === null) {
			return;
		}

		const { queryFound } = removeTemplateVariableQueryText({ editorAPI });

		if (!queryFound) {
			console.warn(
				"handleTemplateVariableSelect: no {{query found at cursor — item was selected but the trigger text could not be located.",
			);
			return;
		}

		const { fromText, fromOffset } = selection.getBoundaryPoints();

		const templateVariable = createTemplateVariable({ fieldName, displayText });

		editorAPI.insertNode({
			fromNode: fromText,
			fromOffset,
			lines: [
				createContentLine({ localName: "p", childNodes: [templateVariable] }),
			],
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
