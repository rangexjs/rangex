import { canSetAttribute } from "@rangex/core";

import type { AnyElementAttrValidators, ComponentAttrsShape } from "../DOMAttrs-types";
import type {
	CreateComponentAttrValidatorsParams,
	CreateComponentAttrValidatorsResult,
	CreateSanitizedAttrValidatorParams,
	CreateSanitizedAttrValidatorResult,
} from "./CreateComponentAttrValidators-types";

/*
 * Rejects an attribute the engine's Sanitizer wouldn't set on the element (see canSetAttribute), before running the
 * given validator, so a replaced validator can't allow it either.
 */
const createSanitizedAttrValidator = <Value extends string | null>({
	localName,
	namespaceURI,
	editorRole,
	attrName,
	validateAttr,
}: CreateSanitizedAttrValidatorParams<Value>): CreateSanitizedAttrValidatorResult<Value> => {
	return ({ value }) => {
		const isSettable = canSetAttribute({
			localName,
			namespaceURI,
			name: attrName,
			value,
			editorRole,
		});

		if (!isSettable) {
			return {
				kind: "reject",
				reason: "must be allowed by the SanitizerPolicy",
			};
		}

		return validateAttr({ value });
	};
};

/*
 * Creates a component's attribute validators: for every attribute of the shape, the given override or else the
 * default, wrapped so the Sanitizer must allow the attribute on its element first (see createSanitizedAttrValidator).
 * Which attributes exist, and which of them are required, is decided by the shape.
 */
export const createComponentAttrValidators = <TComponentAttrsShape extends ComponentAttrsShape>({
	componentAttrsShape,
	elementDescriptors,
	defaultValidators,
	validatorOverrides,
}: CreateComponentAttrValidatorsParams<TComponentAttrsShape>): CreateComponentAttrValidatorsResult<TComponentAttrsShape> => {
	const componentAttrValidators: Record<string, AnyElementAttrValidators> = {};

	for (const elementName in componentAttrsShape) {
		const elementDescriptor = elementDescriptors[elementName];
		const defaultElementValidators: AnyElementAttrValidators = defaultValidators[elementName];
		const elementValidatorOverrides: AnyElementAttrValidators =
			validatorOverrides[elementName] ?? {};

		const elementAttrValidators: AnyElementAttrValidators = {};

		for (const attrName in componentAttrsShape[elementName]) {
			const validateAttr =
				elementValidatorOverrides[attrName] ?? defaultElementValidators[attrName];

			if (!validateAttr) {
				throw new Error(`Attribute "${attrName}" has no validator.`);
			}

			elementAttrValidators[attrName] = createSanitizedAttrValidator({
				...elementDescriptor,
				attrName,
				validateAttr,
			});
		}

		componentAttrValidators[elementName] = elementAttrValidators;
	}

	// Has a validator for every attribute of the shape, each wrapping the one given for it
	return componentAttrValidators as CreateComponentAttrValidatorsResult<TComponentAttrsShape>;
};
