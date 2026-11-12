import {
	isTemplateVariableFieldName,
	isTemplateVariableFieldValue,
	maxTemplateVariableFieldNameLength,
	maxTemplateVariableFieldValueLength,
} from "#storage";

import type {
	ValidateTemplateVariableFieldNameParams,
	ValidateTemplateVariableFieldNameResult,
	ValidateTemplateVariableFieldValueParams,
	ValidateTemplateVariableFieldValueResult,
	ValidateTemplateVariablePlacementParams,
	ValidateTemplateVariablePlacementResult,
} from "./ValidateTemplateVariablePlacement-types";

/*
 * Validates a field's name by the storage's rule (see isTemplateVariableFieldName). Returns the mismatch, or null when
 * it's valid.
 */
export const validateTemplateVariableFieldName = ({
	fieldName,
}: ValidateTemplateVariableFieldNameParams): ValidateTemplateVariableFieldNameResult => {
	if (!isTemplateVariableFieldName(fieldName)) {
		return {
			reason: `must not be empty, and at most ${maxTemplateVariableFieldNameLength} characters long`,
		};
	}

	return null;
};

/*
 * Validates a field's value: it must not be empty, and it's checked by the storage's rule (see
 * isTemplateVariableFieldValue). Returns the mismatch, or null when it's valid.
 */
export const validateTemplateVariableFieldValue = ({
	value,
}: ValidateTemplateVariableFieldValueParams): ValidateTemplateVariableFieldValueResult => {
	if (value === "") {
		return { reason: "must not be empty" };
	}

	if (!isTemplateVariableFieldValue(value)) {
		return {
			reason: `must be at most ${maxTemplateVariableFieldValueLength} characters long`,
		};
	}

	return null;
};

/*
 * Validates whether a template variable can be placed for the given field: its name must be valid and declared, and it
 * must have a stored value to display. Returns the mismatch with its field's name, or null when it's valid.
 */
export const validateTemplateVariablePlacement = ({
	fieldName,
	fieldsConfig,
	storage,
}: ValidateTemplateVariablePlacementParams): ValidateTemplateVariablePlacementResult => {
	const fieldNameFailed = validateTemplateVariableFieldName({ fieldName });

	if (fieldNameFailed) {
		return { field: "fieldName", reason: fieldNameFailed.reason };
	}

	if (!Object.hasOwn(fieldsConfig, fieldName)) {
		return { field: "fieldName", reason: "must be declared in fieldsConfig" };
	}

	if (!(Object.hasOwn(storage, fieldName) && storage[fieldName])) {
		return { field: "fieldName", reason: "must have a stored value" };
	}

	return null;
};
