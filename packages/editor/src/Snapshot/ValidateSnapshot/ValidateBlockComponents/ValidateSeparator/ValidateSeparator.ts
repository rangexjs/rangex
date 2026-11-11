import { blockComponentRole, htmlLayoutRole } from "@rangex/core";

import { componentsName } from "#constants";
import { separatorStoragePattern } from "#storage";

import { formatNodePath, resolveDraftDOMAttrs, validateHTMLLayoutState } from "../../_Utilities";
import { validateBlockComponentLine, validateBlockComponentState } from "../_Utilities";
import type {
	CreateSeparatorValidatorResult,
	ValidateSeparatorParams,
	ValidateSeparatorResult,
} from "./ValidateSeparator-types";

/*
 * Validates a Separator and its BlockComponentLine, node by node: each node's own state, then its children. It's built
 * as a BlockComponent holding an empty hr. It has no attributes, so every attribute of these nodes is dropped.
 */
const validateSeparator = ({
	componentDraft,
}: ValidateSeparatorParams): ValidateSeparatorResult => {
	if (componentDraft.editorRole !== blockComponentRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must be a ${blockComponentRole}.`,
		};
	}

	const stateFailed = validateBlockComponentState({
		blockComponentDraft: componentDraft,
		expectedState: {
			editorRole: blockComponentRole,
			name: componentsName.separator,
			content: { type: "custom" },
			editState: "false",
			shouldSelectBeforeRemove: true,
			shouldSelectOnNavigation: true,
			customStorage: separatorStoragePattern,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const lineFailed = validateBlockComponentLine({
		blockComponentDraft: componentDraft,
		lineAttrsShape: {},
		lineAttrValidators: {},
	});

	if (lineFailed) {
		return lineFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: componentDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = componentDraft;

	const htmlLayoutDraft = childNodes.at(0);

	if (childNodes.length !== 1 || htmlLayoutDraft?.editorRole !== htmlLayoutRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must contain exactly one ${htmlLayoutRole}.`,
		};
	}

	const htmlLayoutStateFailed = validateHTMLLayoutState({
		componentDraft,
		htmlLayoutDraft,
		expectedState: {
			editorRole: htmlLayoutRole,
			localName: "hr",
			customStorage: null,
		},
	});

	if (htmlLayoutStateFailed) {
		return htmlLayoutStateFailed;
	}

	const htmlLayoutAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: htmlLayoutDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (htmlLayoutAttrsFailed) {
		return htmlLayoutAttrsFailed;
	}

	if (htmlLayoutDraft.childNodes.length !== 0) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: htmlLayoutDraft })}: must be empty.`,
		};
	}

	return null;
};

/*
 * Creates the Separator's ComponentValidator.
 */
export const createSeparatorValidator = (): CreateSeparatorValidatorResult => {
	return {
		name: componentsName.separator,
		validate: ({ componentDraft }) => validateSeparator({ componentDraft }),
	};
};
