import { htmlLayoutRole, xhtmlNamespaceURI } from "@rangex/core";
import { dataPartName, todoCheckboxPart } from "#constants";
import {
	type ComponentAttrsShape,
	createComponentAttrValidators,
	type ElementAttrsShape,
	type ElementDescriptor,
	type ValidateAttrFn,
	validateBooleanAttr,
} from "../_Utilities";
import type {
	CreateTodoListAttrValidatorsParams,
	CreateTodoListAttrValidatorsResult,
} from "./TodoListDOMAttrs-types";

/*
 * A checkbox's type is always "checkbox": any other value falls back to it.
 */
const validateCheckboxType: ValidateAttrFn<string> = ({ value }) => {
	if (value !== "checkbox") {
		return { kind: "fallback", reason: "must be checkbox", value: "checkbox" };
	}

	return null;
};

/*
 * A checkbox's part name is always the todo checkbox's, which the TodoList's feature finds it by: any other value falls
 * back to it.
 */
const validateCheckboxPartName: ValidateAttrFn<string> = ({ value }) => {
	if (value !== todoCheckboxPart.name) {
		return {
			kind: "fallback",
			reason: `must be ${todoCheckboxPart.name}`,
			value: todoCheckboxPart.name,
		};
	}

	return null;
};

/*
 * The checkbox of a todo item. Its checked attribute is the item's stored checked state.
 */
const checkboxAttrsShape = {
	type: "required",
	[dataPartName]: "required",
	checked: "optional",
} as const satisfies ElementAttrsShape;

const checkboxElement: ElementDescriptor = {
	localName: "input",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: htmlLayoutRole,
};

export const todoListAttrsShape = {
	checkbox: checkboxAttrsShape,
} as const satisfies ComponentAttrsShape;

/*
 * Creates the TodoList's attribute validators: the defaults, replaced by the given ones of the same attributes (see
 * createComponentAttrValidators).
 */
export const createTodoListAttrValidators = (
	validatorOverrides: CreateTodoListAttrValidatorsParams,
): CreateTodoListAttrValidatorsResult => {
	const todoListAttrValidators = createComponentAttrValidators({
		componentAttrsShape: todoListAttrsShape,
		elementDescriptors: { checkbox: checkboxElement },
		defaultValidators: {
			checkbox: {
				type: validateCheckboxType,
				[dataPartName]: validateCheckboxPartName,
				checked: validateBooleanAttr,
			},
		},
		validatorOverrides,
	});

	return todoListAttrValidators;
};
