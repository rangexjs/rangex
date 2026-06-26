import {
	contentLineName,
	contentLineRoleSelector,
	createContentLine,
	createFormattableTexts,
	inlineNestedContextName,
	inlineNestedContextRoleSelector,
	nestedEditableRoleSelector,
} from "rich-text-area";
import { ensureRootEditableStorage } from "../../../_Utilities";
import { componentsName } from "../../../Constants";
import {
	resolveTemplateVariableDisplayText,
	storageToOptions,
} from "../_Utilities";
import {
	ensureTemplateVariableStorage,
	validateTemplateVariableNodeData,
} from "../TemplateVariableStorage";
import type {
	HandleTemplateVariableUpdateParams,
	UpdateAllTemplateVariableNodesParams,
} from "./HandleTemplateVariableUpdate-types";

const updateAllTemplateVariableNodes = ({
	rootEditable,
	storage,
}: UpdateAllTemplateVariableNodesParams) => {
	const nodes = rootEditable.$$querySelectorAll(
		inlineNestedContextRoleSelector,
	);

	for (const node of nodes) {
		if (node.$$editorRole !== inlineNestedContextName) {
			throw new Error("Expected an InlineNestedContext node.");
		}

		if (node.$$componentName !== componentsName.templateVariable) {
			continue;
		}

		const nodeStorage = node.$$customStorage;
		if (!validateTemplateVariableNodeData(nodeStorage)) {
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
				childNodes: [...createFormattableTexts({ data: displayText })],
			}),
		);
	}
};

export const handleTemplateVariableUpdate = ({
	richTextEditorUI,
	editorAPI,
}: HandleTemplateVariableUpdateParams) => {
	const unsubscribe = richTextEditorUI.onNodeInsertion((params) => {
		if (params.type !== "template-variable" || params.action !== "update") {
			return;
		}

		const { options: partialOptions } = params;
		const { rootEditable } = editorAPI;

		const rootEditableStorage = ensureRootEditableStorage({ rootEditable });
		const storage = ensureTemplateVariableStorage({ rootEditableStorage });

		if (partialOptions.firstName !== undefined) {
			storage.firstName = partialOptions.firstName;
		}

		if (partialOptions.lastName !== undefined) {
			storage.lastName = partialOptions.lastName;
		}

		if (partialOptions.email !== undefined) {
			storage.email = partialOptions.email;
		}

		if (partialOptions.date !== undefined) {
			storage.date = partialOptions.date;
		}

		richTextEditorUI.updateNodeInsertionButtonState({
			templateVariable: { options: storageToOptions({ storage }) },
		});

		updateAllTemplateVariableNodes({ rootEditable, storage });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
