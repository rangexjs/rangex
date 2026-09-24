import { linkId } from "../../Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	CreateLinkStorageResult,
	EnsureLinkStorageParams,
	EnsureLinkStorageResult,
	EnsureNodeLinkStorageParams,
	EnsureNodeLinkStorageResult,
	LinkStorage,
} from "./LinkStorage-types";

export const isLinkStorage = (storage: unknown): storage is LinkStorage => {
	return isStorage(storage, { id: linkId });
};

export const validateLinkStorage = (
	storage: unknown,
): storage is LinkStorage => {
	return validateStorage(storage, isLinkStorage);
};

export const createLinkStorage = (): CreateLinkStorageResult => ({
	id: linkId,
	version: storageVersion,
});

export const ensureLinkStorage = ({
	storage,
}: EnsureLinkStorageParams): EnsureLinkStorageResult => {
	if (validateLinkStorage(storage)) {
		return storage;
	}

	return createLinkStorage();
};

export const ensureNodeLinkStorage = ({
	inlineComponent,
}: EnsureNodeLinkStorageParams): EnsureNodeLinkStorageResult => {
	const { $$customStorage } = inlineComponent;

	const storage = ensureLinkStorage({ storage: $$customStorage });
	inlineComponent.$$customStorage = storage;

	return storage;
};
