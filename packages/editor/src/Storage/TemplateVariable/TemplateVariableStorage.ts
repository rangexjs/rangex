import { type JSONPattern, matchJSON } from "#utilities";
import { templateVariableId } from "../_Constants";
import { validateStorage } from "../_Utilities";
import type {
	CreateTemplateVariableStorageParams,
	CreateTemplateVariableStorageResult,
	TemplateVariableStorage,
} from "./TemplateVariableStorage-types";

export const maxTemplateVariableFieldCount = 200;

export const maxTemplateVariableFieldNameLength = 256;

export const maxTemplateVariableFieldValueLength = 1000;

/*
 * A field name is valid if it isn't empty and it's at most maxTemplateVariableFieldNameLength characters long.
 */
export const isTemplateVariableFieldName = (value: unknown) => {
	return (
		typeof value === "string" &&
		value !== "" &&
		value.length <= maxTemplateVariableFieldNameLength
	);
};

/*
 * A stored field value is valid if it's at most maxTemplateVariableFieldValueLength characters long.
 */
export const isTemplateVariableFieldValue = (value: unknown) => {
	return (
		typeof value === "string" &&
		value.length <= maxTemplateVariableFieldValueLength
	);
};

/*
 * The TemplateVariable's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const templateVariableStoragePattern = {
	id: templateVariableId,
	fieldName: isTemplateVariableFieldName,
} satisfies JSONPattern<TemplateVariableStorage>;

/*
 * Matches a value against templateVariableStoragePattern, returning the first mismatch or null.
 */
export const matchTemplateVariableStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: templateVariableStoragePattern });
};

export const isTemplateVariableStorage = (
	storage: unknown,
): storage is TemplateVariableStorage => {
	const mismatch = matchTemplateVariableStorage(storage);

	return !mismatch;
};

export const validateTemplateVariableStorage = (
	storage: unknown,
): storage is TemplateVariableStorage => {
	return validateStorage(storage, isTemplateVariableStorage);
};

export const createTemplateVariableStorage = ({
	fieldName,
}: CreateTemplateVariableStorageParams): CreateTemplateVariableStorageResult => {
	return {
		id: templateVariableId,
		fieldName,
	};
};
