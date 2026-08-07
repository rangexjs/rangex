import { blockQuoteId } from "../../Constants";
import { isStorage, validateStorage } from "../_Utilities";
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
): storage is BlockQuoteStorage => {
	return isStorage(storage, {
		id: blockQuoteId,
		version: blockQuoteStorageVersion,
	});
};

export const validateBlockQuoteStorage = (
	storage: unknown,
): storage is BlockQuoteStorage => {
	return validateStorage(storage, isBlockQuoteStorage);
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
	blockComponent,
}: EnsureNodeBlockQuoteStorageParams): EnsureNodeBlockQuoteStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureBlockQuoteStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
