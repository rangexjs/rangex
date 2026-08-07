import { linkId } from "../../Constants";
import { isStorage, validateStorage } from "../_Utilities";
import type {
	CreateLinkStorageResult,
	EnsureLinkStorageParams,
	EnsureLinkStorageResult,
	EnsureNodeLinkStorageParams,
	EnsureNodeLinkStorageResult,
	LinkStorage,
} from "./LinkStorage-types";

export const linkStorageVersion = 1 as const;

export const isLinkStorage = (storage: unknown): storage is LinkStorage => {
	return isStorage(storage, { id: linkId, version: linkStorageVersion });
};

export const validateLinkStorage = (
	storage: unknown,
): storage is LinkStorage => {
	return validateStorage(storage, isLinkStorage);
};

export const createLinkStorage = (): CreateLinkStorageResult => ({
	id: linkId,
	version: linkStorageVersion,
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
