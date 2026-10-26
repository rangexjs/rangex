import { type JSONPattern, matchJSON } from "#utilities";
import { blockQuoteId } from "../_Constants";
import { storageVersion, validateStorage } from "../_Utilities";
import type {
	BlockQuoteStorage,
	CreateBlockQuoteStorageResult,
	EnsureBlockQuoteStorageParams,
	EnsureBlockQuoteStorageResult,
	EnsureNodeBlockQuoteStorageParams,
	EnsureNodeBlockQuoteStorageResult,
} from "./BlockQuoteStorage-types";

/*
 * The BlockQuote's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const blockQuoteStoragePattern = {
	id: blockQuoteId,
	version: storageVersion,
} satisfies JSONPattern<BlockQuoteStorage>;

/*
 * Matches a value against blockQuoteStoragePattern, returning the first mismatch or null.
 */
export const matchBlockQuoteStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: blockQuoteStoragePattern });
};

export const isBlockQuoteStorage = (
	storage: unknown,
): storage is BlockQuoteStorage => {
	const mismatch = matchBlockQuoteStorage(storage);

	return !mismatch;
};

export const validateBlockQuoteStorage = (
	storage: unknown,
): storage is BlockQuoteStorage => {
	return validateStorage(storage, isBlockQuoteStorage);
};

export const createBlockQuoteStorage = (): CreateBlockQuoteStorageResult => ({
	id: blockQuoteId,
	version: storageVersion,
});

export const ensureBlockQuoteStorage = ({
	storage,
}: EnsureBlockQuoteStorageParams): EnsureBlockQuoteStorageResult => {
	if (validateBlockQuoteStorage(storage)) {
		return storage;
	}

	return createBlockQuoteStorage();
};

export const ensureNodeBlockQuoteStorage = ({
	blockComponent,
}: EnsureNodeBlockQuoteStorageParams): EnsureNodeBlockQuoteStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureBlockQuoteStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
