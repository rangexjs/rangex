import { type JSONPattern, matchJSON } from "#utilities";
import { templateVariableId } from "../_Constants";
import { validateStorage } from "../_Utilities";
import type {
	CreateTemplateVariableStorageParams,
	CreateTemplateVariableStorageResult,
	EnsureNodeTemplateVariableStorageParams,
	EnsureNodeTemplateVariableStorageResult,
	EnsureTemplateVariableStorageParams,
	EnsureTemplateVariableStorageResult,
	TemplateVariableStorage,
} from "./TemplateVariableStorage-types";

/*
 * A field name is valid if it isn't empty and it's at most 256 characters long.
 */
const isFieldName = (value: unknown) => {
	const maxFieldNameLength = 256;

	return (
		typeof value === "string" &&
		value !== "" &&
		value.length <= maxFieldNameLength
	);
};

/*
 * The TemplateVariable's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const templateVariableStoragePattern = {
	id: templateVariableId,
	fieldName: isFieldName,
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

export const ensureTemplateVariableStorage = ({
	storage,
	fallbacks,
}: EnsureTemplateVariableStorageParams): EnsureTemplateVariableStorageResult => {
	if (validateTemplateVariableStorage(storage)) {
		return storage;
	}

	return createTemplateVariableStorage(fallbacks);
};

export const ensureNodeTemplateVariableStorage = ({
	inlineComponent,
	fallbacks,
}: EnsureNodeTemplateVariableStorageParams): EnsureNodeTemplateVariableStorageResult => {
	const { $$customStorage } = inlineComponent;

	const storage = ensureTemplateVariableStorage({
		storage: $$customStorage,
		fallbacks,
	});
	inlineComponent.$$customStorage = storage;

	return storage;
};
