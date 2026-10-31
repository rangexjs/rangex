import { type JSONPattern, matchJSON } from "#utilities";
import { separatorId } from "../_Constants";
import { validateStorage } from "../_Utilities";
import type {
	CreateSeparatorStorageResult,
	EnsureNodeSeparatorStorageParams,
	EnsureNodeSeparatorStorageResult,
	EnsureSeparatorStorageParams,
	EnsureSeparatorStorageResult,
	SeparatorStorage,
} from "./SeparatorStorage-types";

/*
 * The Separator's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const separatorStoragePattern = {
	id: separatorId,
} satisfies JSONPattern<SeparatorStorage>;

/*
 * Matches a value against separatorStoragePattern, returning the first mismatch or null.
 */
export const matchSeparatorStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: separatorStoragePattern });
};

export const isSeparatorStorage = (
	storage: unknown,
): storage is SeparatorStorage => {
	const mismatch = matchSeparatorStorage(storage);

	return !mismatch;
};

export const validateSeparatorStorage = (
	storage: unknown,
): storage is SeparatorStorage => {
	return validateStorage(storage, isSeparatorStorage);
};

export const createSeparatorStorage = (): CreateSeparatorStorageResult => ({
	id: separatorId,
});

export const ensureSeparatorStorage = ({
	storage,
}: EnsureSeparatorStorageParams): EnsureSeparatorStorageResult => {
	if (validateSeparatorStorage(storage)) {
		return storage;
	}

	return createSeparatorStorage();
};

export const ensureNodeSeparatorStorage = ({
	blockComponent,
}: EnsureNodeSeparatorStorageParams): EnsureNodeSeparatorStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureSeparatorStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
