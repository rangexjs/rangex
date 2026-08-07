import {
	createContentLine,
	createFormattableTexts,
	createInlineComponent,
	createNestedEditable,
} from "rich-text-area";
import { componentsName } from "#ports";
import {
	createTemplateVariableStorage,
	ensureNodeRootStorage,
} from "../../../Storage";
import {
	getTemplateVariableQuery,
	resolveTemplateVariableDisplayText,
} from "../_Utilities";
import type {
	CreateTemplateVariableComponentParams,
	CreateTemplateVariableComponentResult,
	HandleTemplateVariableOverlayInsertionParams,
	RemoveTemplateVariableQueryTextParams,
	RemoveTemplateVariableQueryTextResult,
} from "./HandleTemplateVariableOverlayInsertion-types";

/**
 * Removes the {{query text (e.g. "{{FirstName") that triggered the popover, before the component is inserted.
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

const createTemplateVariableComponent = ({
	type,
	displayText,
}: CreateTemplateVariableComponentParams): CreateTemplateVariableComponentResult => {
	return createInlineComponent({
		componentName: componentsName.templateVariable,
		content: { type: "custom" },
		editState: "false",
		shouldSelectOnNavigation: true,
		customStorage: createTemplateVariableStorage({ type }),
		childNodes: [
			createNestedEditable({
				content: { type: "default" },
				display: "inline",
				childNodes: [
					createContentLine({
						localName: "span",
						childNodes: [...createFormattableTexts({ data: displayText })],
					}),
				],
			}),
		],
	});
};

/**
 * Subscribes to template variable popover selection and inserts the component at the cursor.
 * On select, strips the {{query text first, then re-reads the cursor position and inserts there.
 */
export const handleTemplateVariableOverlayInsertion = ({
	editorPort,
	editorAPI,
}: HandleTemplateVariableOverlayInsertionParams) => {
	const { rootEditable } = editorAPI;

	const selection = editorAPI.getEditorSelection();

	const unsubscribe = editorPort.onSelect(({ kind }) => {
		const { queryFound } = removeTemplateVariableQueryText({ editorAPI });

		if (!queryFound) {
			console.warn(
				"handleTemplateVariableOverlayInsertion: no {{query found at cursor — item was selected but the trigger text could not be located.",
			);
			return;
		}

		const { fromText, fromOffset } = selection.getBoundaryPoints();

		const rootStorage = ensureNodeRootStorage({ rootEditable });

		const displayText = resolveTemplateVariableDisplayText({
			type: kind,
			storage: rootStorage.templateVariable,
		});

		const templateVariable = createTemplateVariableComponent({
			type: kind,
			displayText,
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
