import { maxTemplateVariableFieldCount } from "#storage";
import {
	validateTemplateVariableFieldName,
	validateTemplateVariableFieldValue,
} from "../../../_Utilities";
import type {
	ValidateTemplateVariableFieldParams,
	ValidateTemplateVariableFieldResult,
} from "./ValidateTemplateVariableField-types";

/*
 * Validates whether a field can be written to the Root's storage, so the snapshot saved with it can be loaded again: its
 * name and value must be valid, and a new field must fit in the storage. Returns the mismatch with its field's name, or
 * null when it's valid.
 */
export const validateTemplateVariableField = ({
	fieldName,
	value,
	storage,
}: ValidateTemplateVariableFieldParams): ValidateTemplateVariableFieldResult => {
	const fieldNameFailed = validateTemplateVariableFieldName({ fieldName });

	if (fieldNameFailed) {
		return { field: "fieldName", reason: fieldNameFailed.reason };
	}

	const valueFailed = validateTemplateVariableFieldValue({ value });

	if (valueFailed) {
		return { field: "value", reason: valueFailed.reason };
	}

	const isStored = Object.hasOwn(storage, fieldName);

	const fieldCount = Object.keys(storage).length;

	if (!isStored && fieldCount >= maxTemplateVariableFieldCount) {
		return {
			field: "fieldName",
			reason: `can't be stored: the limit is ${maxTemplateVariableFieldCount} fields`,
		};
	}

	return null;
};
