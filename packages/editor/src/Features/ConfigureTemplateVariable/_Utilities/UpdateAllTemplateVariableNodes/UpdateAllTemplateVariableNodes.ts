import {
	contentLineRole,
	contentLineRoleSelector,
	createContentLine,
	createFormattableTexts,
	inlineComponentRole,
	nestedEditableRoleSelector,
} from "@rangex/core";
import { componentsName, createComponentSelector } from "#engine-links";
import { validateTemplateVariableStorage } from "#storage";
import { getTemplateVariableDisplayText } from "../GetTemplateVariableDisplayText";
import type { UpdateAllTemplateVariableNodesParams } from "./UpdateAllTemplateVariableNodes-types";

const templateVariableSelector = createComponentSelector(
	componentsName.templateVariable,
);

/*
 * Re-resolves the display text of every template variable node from the stored values. Nodes whose field isn't declared
 * keep their current text.
 */
export const updateAllTemplateVariableNodes = ({
	rootEditable,
	storage,
	fieldsConfig,
}: UpdateAllTemplateVariableNodesParams) => {
	const nodes = rootEditable.$$querySelectorAll(templateVariableSelector);

	for (const node of nodes) {
		if (node.$$editorRole !== inlineComponentRole) {
			throw new Error("Expected an InlineComponent node.");
		}

		const nodeStorage = node.$$customStorage;

		if (!validateTemplateVariableStorage(nodeStorage)) {
			continue;
		}

		const displayText = getTemplateVariableDisplayText({
			fieldName: nodeStorage.fieldName,
			fieldsConfig,
			storage,
		});

		if (displayText === null) {
			continue;
		}

		const nestedEditable = node.$$querySelector(nestedEditableRoleSelector);

		if (!nestedEditable) {
			throw new Error(
				"Expected a NestedEditable inside the template variable node.",
			);
		}

		const contentLine = nestedEditable.$$querySelector(contentLineRoleSelector);

		if (contentLine?.$$editorRole !== contentLineRole) {
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
