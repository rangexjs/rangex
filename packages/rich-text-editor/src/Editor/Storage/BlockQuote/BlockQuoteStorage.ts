import { blockQuoteId } from "../../Constants";
import type {
	BlockQuoteStorage,
	CreateBlockQuoteStorageResult,
	EnsureBlockQuoteStorageParams,
	EnsureBlockQuoteStorageResult,
	EnsureNodeBlockQuoteStorageParams,
	EnsureNodeBlockQuoteStorageResult,
} from "./BlockQuoteStorage-types";

export const blockQuoteStorageVersion = 1 as const;

export const isBlockQuoteStorage = (
	storage: unknown,
): storage is BlockQuoteStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === blockQuoteId &&
	"version" in storage &&
	storage.version === blockQuoteStorageVersion;

export const validateBlockQuoteStorage = (
	storage: unknown,
): storage is BlockQuoteStorage => {
	const isValid = isBlockQuoteStorage(storage);

	if (!isValid) {
		console.warn("validateBlockQuoteStorage: unexpected data shape", storage);
	}

	return isValid;
};

export const createBlockQuoteStorage = (): CreateBlockQuoteStorageResult => ({
	id: blockQuoteId,
	version: blockQuoteStorageVersion,
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
	blockNestedContext,
}: EnsureNodeBlockQuoteStorageParams): EnsureNodeBlockQuoteStorageResult => {
	const { $$customStorage } = blockNestedContext;

	const storage = ensureBlockQuoteStorage({ storage: $$customStorage });
	blockNestedContext.$$customStorage = storage;

	return storage;
};
