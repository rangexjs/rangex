import { nestedEditableRole, xhtmlNamespaceURI } from "@rangex/core";
import { verticalAlignAttr } from "#constants";
import {
	type ComponentAttrsShape,
	createComponentAttrValidators,
	type ElementAttrsShape,
	type ElementDescriptor,
	type ValidateAttrFn,
} from "../_Utilities";
import type {
	CreateTableAttrValidatorsParams,
	CreateTableAttrValidatorsResult,
} from "./TableDOMAttrs-types";

const verticalAligns = new Set<string>(Object.values(verticalAlignAttr.value));

/*
 * A cell's vertical alignment is valid if it's one of verticalAlignAttr's values: any other value is dropped, so the
 * cell is top-aligned.
 */
const validateVerticalAlign: ValidateAttrFn<string | null> = ({ value }) => {
	if (!verticalAligns.has(value)) {
		return {
			kind: "fallback",
			reason: `must be ${[...verticalAligns].join(", ")}`,
			value: null,
		};
	}

	return null;
};

/*
 * The NestedEditable of a table cell
 */
const cellNestedEditableAttrsShape = {
	[verticalAlignAttr.name]: "optional",
} as const satisfies ElementAttrsShape;

const cellNestedEditableElement: ElementDescriptor = {
	localName: "div",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: nestedEditableRole,
};

export const tableAttrsShape = {
	cellNestedEditable: cellNestedEditableAttrsShape,
} as const satisfies ComponentAttrsShape;

/*
 * Creates the Table's attribute validators: the defaults, replaced by the given ones of the same attributes (see
 * createComponentAttrValidators).
 */
export const createTableAttrValidators = (
	validatorOverrides: CreateTableAttrValidatorsParams,
): CreateTableAttrValidatorsResult => {
	const tableAttrValidators = createComponentAttrValidators({
		componentAttrsShape: tableAttrsShape,
		elementDescriptors: { cellNestedEditable: cellNestedEditableElement },
		defaultValidators: {
			cellNestedEditable: {
				[verticalAlignAttr.name]: validateVerticalAlign,
			},
		},
		validatorOverrides,
	});

	return tableAttrValidators;
};
