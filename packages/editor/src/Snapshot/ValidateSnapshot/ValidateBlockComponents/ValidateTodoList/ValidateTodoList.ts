import {
	blockComponentRole,
	htmlLayoutRole,
	listRole,
	nestedEditableRole,
} from "@rangex/core";
import { componentsName, todoListDefinition } from "#constants";
import { createTodoListAttrValidators, todoListAttrsShape } from "#dom-attrs";
import { todoListStoragePattern } from "#storage";
import { matchJSON } from "#utilities";
import {
	describeJSONMismatch,
	formatNodePath,
	resolveDraftDOMAttrs,
	validateHTMLLayoutState,
	validateNestedEditableState,
} from "../../_Utilities";
import {
	validateBlockComponentLine,
	validateBlockComponentState,
} from "../_Utilities";
import type {
	CreateTodoListValidatorResult,
	ValidateCheckboxParams,
	ValidateCheckboxResult,
	ValidateTodoItemParams,
	ValidateTodoItemResult,
	ValidateTodoListNodeParams,
	ValidateTodoListNodeResult,
	ValidateTodoListParams,
	ValidateTodoListResult,
} from "./ValidateTodoList-types";

/*
 * Validates a todo item's checkbox: an empty input, whose domAttrs are resolved by the TodoList's checkbox shape and
 * validators.
 */
const validateCheckbox = ({
	componentDraft,
	htmlLayoutDraft,
	attrValidators,
}: ValidateCheckboxParams): ValidateCheckboxResult => {
	const stateFailed = validateHTMLLayoutState({
		componentDraft,
		htmlLayoutDraft,
		expectedState: {
			editorRole: htmlLayoutRole,
			localName: "input",
			customStorage: null,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: htmlLayoutDraft,
		elementAttrsShape: todoListAttrsShape.checkbox,
		elementAttrValidators: attrValidators.checkbox,
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
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
 * Validates a todo item: a ListItem holding its checkbox, then its multi-line NestedEditable. The NestedEditable's
 * content is left to the engine's validation.
 */
const validateTodoItem = ({
	componentDraft,
	listItemDraft,
	attrValidators,
}: ValidateTodoItemParams): ValidateTodoItemResult => {
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

	const [checkboxDraft, nestedEditableDraft] = childNodes;

	if (
		childNodes.length !== 2 ||
		checkboxDraft?.editorRole !== htmlLayoutRole ||
		nestedEditableDraft?.editorRole !== nestedEditableRole
	) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: listItemDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: listItemDraft })}: must contain an ${htmlLayoutRole}, then a ${nestedEditableRole}.`,
		};
	}

	const checkboxFailed = validateCheckbox({
		componentDraft,
		htmlLayoutDraft: checkboxDraft,
		attrValidators,
	});

	if (checkboxFailed) {
		return checkboxFailed;
	}

	const nestedEditableFailed = validateNestedEditableState({
		componentDraft,
		nestedEditableDraft,
		expectedState: {
			editorRole: nestedEditableRole,
			...todoListDefinition.itemNestedEditableProps,
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
 * Validates the engine's List and each of its todo items.
 */
const validateTodoListNode = ({
	componentDraft,
	listDraft,
	attrValidators,
}: ValidateTodoListNodeParams): ValidateTodoListNodeResult => {
	const { localName, lineType, editState, customStorage } = listDraft;

	const listState = { localName, lineType, editState, customStorage };

	const listMismatch = matchJSON({
		value: listState,
		pattern: {
			localName: todoListDefinition.localName,
			lineType: todoListDefinition.lineType,
			editState: todoListDefinition.editState,
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
		const todoItemFailed = validateTodoItem({
			componentDraft,
			listItemDraft,
			attrValidators,
		});

		if (todoItemFailed) {
			return todoItemFailed;
		}
	}

	return null;
};

/*
 * Validates a TodoList, its BlockComponentLine, and everything down to its NestedEditables, node by node: each node's
 * own state, then its children. It's built as a BlockComponent holding an unordered multi-line List, whose ListItems
 * each hold a checkbox and a NestedEditable. The checkboxes' domAttrs are resolved by the TodoList's validators, every
 * other node's by an empty shape. The NestedEditables' content is left to the engine's validation.
 */
const validateTodoList = ({
	componentDraft,
	attrValidators,
}: ValidateTodoListParams): ValidateTodoListResult => {
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
			name: componentsName.todoList,
			content: { type: "list" },
			editState: "inherit",
			shouldSelectBeforeRemove: false,
			shouldSelectOnNavigation: false,
			customStorage: todoListStoragePattern,
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

	const listNodeFailed = validateTodoListNode({
		componentDraft,
		listDraft,
		attrValidators,
	});

	if (listNodeFailed) {
		return listNodeFailed;
	}

	return null;
};

/*
 * Creates the TodoList's ComponentValidator, which validates the checkboxes' attributes by the TodoList's validators
 * (see createTodoListAttrValidators).
 */
export const createTodoListValidator = (): CreateTodoListValidatorResult => {
	const todoListAttrValidators = createTodoListAttrValidators({});

	return {
		name: componentsName.todoList,
		validate: ({ componentDraft }) =>
			validateTodoList({
				componentDraft,
				attrValidators: todoListAttrValidators,
			}),
	};
};
