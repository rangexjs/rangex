import { createContentLine } from "@rangex/core";
import { getRootStorage } from "#storage";
import {
	createTemplateVariable,
	validateTemplateVariablePlacement,
} from "../../_Utilities";
import { getTemplateVariableQuery } from "../_Utilities";
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
 * Subscribes to caret-menu selection and inserts the component at the cursor. On select,
 * validates the field, so one that can't be placed leaves the {{query text as it is, strips the
 * {{query text, then re-reads the cursor position and inserts there. Returns a cleanup function.
 */
export const handleTemplateVariableSelect = ({
	configPort,
	editorAPI,
}: HandleTemplateVariableSelectParams) => {
	const { rootEditable } = editorAPI;

	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onSelect(({ fieldName }) => {
		const { templateVariable: storage } = getRootStorage({ rootEditable });

		const placementMismatch = validateTemplateVariablePlacement({
			fieldName,
			fieldsConfig: configPort.fieldsConfig,
			storage,
		});

		if (placementMismatch) {
			console.warn(placementMismatch);
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

		const templateVariable = createTemplateVariable({
			fieldName,
			displayText: storage[fieldName],
		});

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
