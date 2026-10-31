import { type JSONPattern, matchJSON } from "#utilities";
import { rootId } from "../_Constants";
import { validateStorage } from "../_Utilities";
import type {
	CreateRootStorageResult,
	EnsureNodeRootStorageParams,
	EnsureNodeRootStorageResult,
	EnsureRootStorageParams,
	EnsureRootStorageResult,
	RootStorage,
} from "./RootStorage-types";

/*
 * The version of the snapshot's editor structure, kept on the RootStorage. Bumped on any change to a snapshot the editor
 * makes (e.g. a component's structure or storage, a ScopedEditable's allowedComponents).
 *
 * Note: The engine's own changes are tracked by the StoredSnapshot's version.
 */
export const snapshotVersion = 1 as const;

/*
 * The template variable fields are valid if they're an object of at most 200 fields, each named by a non-empty name of
 * at most 64 characters, with a value of at most 1000 characters.
 */
const isTemplateVariableFields = (value: unknown) => {
	const maxFieldCount = 200;
	const maxFieldNameLength = 64;
	const maxFieldValueLength = 1000;

	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return false;
	}

	const fields = Object.entries(value);

	if (fields.length > maxFieldCount) {
		return false;
	}

	return fields.every(
		([fieldName, fieldValue]) =>
			fieldName !== "" &&
			fieldName.length <= maxFieldNameLength &&
			typeof fieldValue === "string" &&
			fieldValue.length <= maxFieldValueLength,
	);
};

/*
 * The Root's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const rootStoragePattern = {
	id: rootId,
	version: snapshotVersion,
	templateVariable: isTemplateVariableFields,
} satisfies JSONPattern<RootStorage>;

/*
 * Matches a value against rootStoragePattern, returning the first mismatch or null.
 */
export const matchRootStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: rootStoragePattern });
};

export const isRootStorage = (storage: unknown): storage is RootStorage => {
	const mismatch = matchRootStorage(storage);

	return !mismatch;
};

export const validateRootStorage = (
	storage: unknown,
): storage is RootStorage => {
	return validateStorage(storage, isRootStorage);
};

export const createRootStorage = (): CreateRootStorageResult => ({
	id: rootId,
	version: snapshotVersion,
	templateVariable: {},
});

export const ensureRootStorage = ({
	storage,
}: EnsureRootStorageParams): EnsureRootStorageResult => {
	if (validateRootStorage(storage)) {
		return storage;
	}

	return createRootStorage();
};

export const ensureNodeRootStorage = ({
	rootEditable,
}: EnsureNodeRootStorageParams): EnsureNodeRootStorageResult => {
	const { $$customStorage } = rootEditable;

	const storage = ensureRootStorage({ storage: $$customStorage });
	rootEditable.$$customStorage = storage;

	return storage;
};
