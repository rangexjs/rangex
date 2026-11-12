import { rootEditableRole, xhtmlNamespaceURI } from "@rangex/core";

import {
	type ComponentAttrsShape,
	createComponentAttrValidators,
	type ElementAttrsShape,
	type ElementDescriptor,
	type ValidateAttrFn,
} from "../_Utilities";
import type {
	CreateRootAttrValidatorsParams,
	CreateRootAttrValidatorsResult,
} from "./RootDOMAttrs-types";

const rootElementAttrsShape = {
	spellcheck: "optional",
} as const satisfies ElementAttrsShape;

const rootElement: ElementDescriptor = {
	localName: "div",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: rootEditableRole,
};

export const rootAttrsShape = {
	root: rootElementAttrsShape,
} as const satisfies ComponentAttrsShape;

const validateSpellcheck: ValidateAttrFn<string | null> = ({ value }) => {
	const allowedSpellchecks = new Set(["true", "false"]);

	if (!allowedSpellchecks.has(value)) {
		return {
			kind: "fallback",
			reason: 'must be "true" or "false"',
			value: null,
		};
	}

	return null;
};

/*
 * Creates the Root's attribute validators: the defaults, replaced by the given ones of the same attributes (see
 * createComponentAttrValidators).
 */
export const createRootAttrValidators = (
	validatorOverrides: CreateRootAttrValidatorsParams,
): CreateRootAttrValidatorsResult => {
	const rootAttrValidators = createComponentAttrValidators({
		componentAttrsShape: rootAttrsShape,
		elementDescriptors: { root: rootElement },
		defaultValidators: {
			root: {
				spellcheck: validateSpellcheck,
			},
		},
		validatorOverrides,
	});

	return rootAttrValidators;
};
