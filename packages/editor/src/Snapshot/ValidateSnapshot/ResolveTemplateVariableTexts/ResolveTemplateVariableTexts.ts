import {
	contentLineRole,
	isComponentDraft,
	isFormattableTextDraft,
	snapshotManager,
} from "@rangex/core";

import { componentsName } from "#constants";
import type { RootStorage, TemplateVariableStorage } from "#storage";

import type {
	GetDisplayContentLineParams,
	ResolveTemplateVariableTextsParams,
} from "./ResolveTemplateVariableTexts-types";

/*
 * Returns the ContentLine holding a TemplateVariable's display text, which its validator guarantees.
 */
const getDisplayContentLine = ({ componentDraft }: GetDisplayContentLineParams) => {
	const contentLineDraft = componentDraft.query(({ editorRole }) => editorRole === contentLineRole);

	if (contentLineDraft?.editorRole !== contentLineRole) {
		throw new Error("Expected a ContentLine inside the TemplateVariable.");
	}

	return contentLineDraft;
};

/*
 * Matches every TemplateVariable's display text to its field's value in the Root's storage, which is the source of
 * truth: a different text is replaced, so a snapshot read without the editor shows the right value. A TemplateVariable
 * whose field has no value keeps its text; the consumer's validateStorage can reject it. Must run after the Root and the
 * components are validated, as it relies on their structure and resolved storages.
 */
export const resolveTemplateVariableTexts = ({
	rootEditableDraft,
}: ResolveTemplateVariableTextsParams) => {
	// validateRoot guarantees the storage's shape
	const { templateVariable: fields } = rootEditableDraft.customStorage as RootStorage;

	const nodeDrafts = rootEditableDraft.queryAll(isComponentDraft);

	// queryAll's result isn't narrowed by its predicate
	const componentDrafts = nodeDrafts.filter(isComponentDraft);

	for (const componentDraft of componentDrafts) {
		if (componentDraft.name !== componentsName.templateVariable) {
			continue;
		}

		// The component's validator guarantees the storage's shape
		const { fieldName } = componentDraft.customStorage as TemplateVariableStorage;

		const hasValue = Object.hasOwn(fields, fieldName) && fields[fieldName] !== "";

		if (!hasValue) {
			continue;
		}

		const fieldValue = fields[fieldName];

		const contentLineDraft = getDisplayContentLine({ componentDraft });

		const textDrafts = contentLineDraft.childNodes.filter(isFormattableTextDraft);

		const displayText = textDrafts.map(({ data }) => data).join("");

		if (displayText === fieldValue) {
			continue;
		}

		const fieldValueDrafts = snapshotManager.createFormattableTextDrafts({
			data: fieldValue,
		});

		contentLineDraft.replaceChildren(...fieldValueDrafts);
	}
};
