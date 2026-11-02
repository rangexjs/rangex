import { blockComponentRole, listRole, nestedEditableRole } from "@rangex/core";
import { componentsName } from "#constants";
import { listStoragePattern } from "#storage";
import { matchJSON } from "#utilities";
import {
	describeJSONMismatch,
	formatNodePath,
	resolveDraftDOMAttrs,
	validateNestedEditableState,
} from "../../_Utilities";
import {
	validateBlockComponentLine,
	validateBlockComponentState,
} from "../_Utilities";
import type {
	CreateListValidatorResult,
	ValidateListItemParams,
	ValidateListItemResult,
	ValidateListNodeParams,
	ValidateListNodeResult,
	ValidateListParams,
	ValidateListResult,
} from "./ValidateList-types";

/*
 * Validates a list item: a ListItem holding only its multi-line NestedEditable. The NestedEditable's content is left to
 * the engine's validation, a nested List included, as it's a List component of its own.
 */
const validateListItem = ({
	componentDraft,
	listItemDraft,
}: ValidateListItemParams): ValidateListItemResult => {
	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: listItemDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = listItemDraft;

	const nestedEditableDraft = childNodes.at(0);

	if (
		childNodes.length !== 1 ||
		nestedEditableDraft?.editorRole !== nestedEditableRole
	) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: listItemDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: listItemDraft })}: must contain exactly one ${nestedEditableRole}.`,
		};
	}

	const nestedEditableFailed = validateNestedEditableState({
		componentDraft,
		nestedEditableDraft,
		expectedState: {
			editorRole: nestedEditableRole,
			display: "block multi-line",
			editState: "inherit",
			allowedComponents: null,
			allowedContentLineLocalNames: null,
			allowedContentLineStyleAttrNames: null,
			allowedGlyphFormatterStyleAttrNames: null,
			allowedGlyphFormatterInlineTags: null,
			domAttrs: {},
			customStorage: null,
		},
	});

	if (nestedEditableFailed) {
		return nestedEditableFailed;
	}

	return null;
};

/*
 * Validates the engine's List and each of its ListItems. Its localName (ol or ul) is left to the engine's validation.
 */
const validateListNode = ({
	componentDraft,
	listDraft,
}: ValidateListNodeParams): ValidateListNodeResult => {
	const { lineType, editState, customStorage } = listDraft;

	const listState = { lineType, editState, customStorage };

	const listMismatch = matchJSON({
		value: listState,
		pattern: {
			lineType: "multi-line",
			editState: "inherit",
			customStorage: null,
		},
	});

	if (listMismatch) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: listDraft,
			reason: describeJSONMismatch({
				rootDraft: componentDraft,
				nodeDraft: listDraft,
				value: listState,
				mismatch: listMismatch,
			}),
		};
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: listDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	for (const listItemDraft of listDraft.childNodes) {
		const listItemFailed = validateListItem({ componentDraft, listItemDraft });

		if (listItemFailed) {
			return listItemFailed;
		}
	}

	return null;
};

/*
 * Validates a List component, its BlockComponentLine, and everything down to its NestedEditables, node by node: each
 * node's own state, then its children. It's built as a BlockComponent holding the engine's List, with one ListItem per
 * item. It has no attributes, so every attribute of these nodes is dropped. The NestedEditables' content is left to the
 * engine's validation.
 */
const validateList = ({
	componentDraft,
}: ValidateListParams): ValidateListResult => {
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
			name: componentsName.list,
			content: { type: "list" },
			editState: "inherit",
			shouldSelectBeforeRemove: false,
			shouldSelectOnNavigation: false,
			customStorage: listStoragePattern,
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

	const listDraft = childNodes.at(0);

	if (childNodes.length !== 1 || listDraft?.editorRole !== listRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must contain exactly one ${listRole}.`,
		};
	}

	const listNodeFailed = validateListNode({ componentDraft, listDraft });

	if (listNodeFailed) {
		return listNodeFailed;
	}

	return null;
};

/*
 * Creates the List's ComponentValidator.
 */
export const createListValidator = (): CreateListValidatorResult => {
	return {
		name: componentsName.list,
		validate: ({ componentDraft }) => validateList({ componentDraft }),
	};
};
