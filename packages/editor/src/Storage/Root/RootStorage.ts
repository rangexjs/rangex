import { isRootType } from "#constants";
import type { JSONPattern } from "#utilities";

import { rootId } from "../_Constants";
import {
	isTemplateVariableFieldName,
	isTemplateVariableFieldValue,
	maxTemplateVariableFieldCount,
} from "../TemplateVariable";
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
 * The template variable fields are valid if they're an object of at most maxTemplateVariableFieldCount fields, each with
 * a valid name and value.
 */
const isTemplateVariableFields = (value: unknown) => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return false;
	}

	const fields = Object.entries(value);

	if (fields.length > maxTemplateVariableFieldCount) {
		return false;
	}

	return fields.every(
		([fieldName, fieldValue]) =>
			isTemplateVariableFieldName(fieldName) && isTemplateVariableFieldValue(fieldValue),
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

export const createRootStorage = ({ type }: CreateRootStorageParams): CreateRootStorageResult => ({
	id: rootId,
	version: snapshotVersion,
	type,
	templateVariable: {},
});

/*
 * Reads the Root's storage. Every RootEditable has a valid one: createCore creates it with createRoot, or validates the
 * snapshot's before loading it.
 */
export const getRootStorage = ({ rootEditable }: GetRootStorageParams): GetRootStorageResult =>
	rootEditable.$$customStorage as RootStorage;
