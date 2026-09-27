import {
	contentLineName,
	contentLineRoleSelector,
	createContentLine,
	createFormattableTexts,
	inlineComponentName,
	inlineComponentRoleSelector,
	nestedEditableRoleSelector,
} from "rich-text-area";
import {
	componentsName,
	ensureNodeRootStorage,
	validateTemplateVariableStorage,
} from "#engine-links";
import {
	resolveTemplateVariableDisplayText,
	storageToOptions,
} from "../_Utilities";
import type {
	HandleTemplateVariableUpdateParams,
	UpdateAllTemplateVariableNodesParams,
} from "./HandleTemplateVariableUpdate-types";

const updateAllTemplateVariableNodes = ({
	rootEditable,
	storage,
}: UpdateAllTemplateVariableNodesParams) => {
	const nodes = rootEditable.$$querySelectorAll(inlineComponentRoleSelector);

	for (const node of nodes) {
		if (node.$$editorRole !== inlineComponentName) {
			throw new Error("Expected an InlineComponent node.");
		}

		if (node.$$name !== componentsName.templateVariable) {
			continue;
		}

		const nodeStorage = node.$$customStorage;

		if (!validateTemplateVariableStorage(nodeStorage)) {
			continue;
		}

		const displayText = resolveTemplateVariableDisplayText({
			type: nodeStorage.type,
			storage,
		});

		const nestedEditable = node.$$querySelector(nestedEditableRoleSelector);

		if (!nestedEditable) {
			throw new Error(
				"Expected a NestedEditable inside the template variable node.",
			);
		}

		const contentLine = nestedEditable.$$querySelector(contentLineRoleSelector);

		if (contentLine?.$$editorRole !== contentLineName) {
			throw new Error("Expected a ContentLine inside the NestedEditable.");
		}

		contentLine.$$replaceWith(
			createContentLine({
				localName: "span",
				childNodes: [...createFormattableTexts({ data: displayText })],
			}),
		);
	}
};

/*
 * Subscribes to option updates, persists changed values into root storage, refreshes every
 * template variable node's display text to match, and registers a snapshot boundary. Returns
 * a cleanup function.
 */
export const handleTemplateVariableUpdate = ({
	configPort,
	editorAPI,
}: HandleTemplateVariableUpdateParams) => {
	const unsubscribe = configPort.onOptions((options) => {
		const { rootEditable } = editorAPI;

		const rootStorage = ensureNodeRootStorage({ rootEditable });
		const { templateVariable: storage } = rootStorage;

		if (options.firstName !== undefined) {
			storage.firstName = options.firstName;
		}

		if (options.lastName !== undefined) {
			storage.lastName = options.lastName;
		}

		if (options.email !== undefined) {
			storage.email = options.email;
		}

		if (options.date !== undefined) {
			storage.date = options.date;
		}

		configPort.updateState({ options: storageToOptions({ storage }) });

		updateAllTemplateVariableNodes({ rootEditable, storage });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
