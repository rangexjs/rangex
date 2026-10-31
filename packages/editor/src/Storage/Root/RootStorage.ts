import { isRootType } from "#constants";
import type { JSONPattern } from "#utilities";
import { rootId } from "../_Constants";
import type {
	CreateRootStorageParams,
	CreateRootStorageResult,
	GetRootStorageParams,
	GetRootStorageResult,
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
 * at most 256 characters, with a value of at most 1000 characters.
 */
const isTemplateVariableFields = (value: unknown) => {
	const maxFieldCount = 200;
	const maxFieldNameLength = 256;
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
	type: isRootType,
	templateVariable: isTemplateVariableFields,
} satisfies JSONPattern<RootStorage>;

export const createRootStorage = ({
	type,
}: CreateRootStorageParams): CreateRootStorageResult => ({
	id: rootId,
	version: snapshotVersion,
	type,
	templateVariable: {},
});

/*
 * Reads the Root's storage. Every RootEditable has a valid one: createCore creates it with createRoot, or validates the
 * snapshot's before loading it.
 */
export const getRootStorage = ({
	rootEditable,
}: GetRootStorageParams): GetRootStorageResult =>
	rootEditable.$$customStorage as RootStorage;
