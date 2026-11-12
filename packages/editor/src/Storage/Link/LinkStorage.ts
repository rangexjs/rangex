import { type JSONPattern, matchJSON } from "#utilities";

import { linkId } from "../_Constants";
import { validateStorage } from "../_Utilities";
import type {
	CreateLinkStorageResult,
	EnsureLinkStorageParams,
	EnsureLinkStorageResult,
	EnsureNodeLinkStorageParams,
	EnsureNodeLinkStorageResult,
	LinkStorage,
} from "./LinkStorage-types";

/*
 * The Link's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const linkStoragePattern = {
	id: linkId,
} satisfies JSONPattern<LinkStorage>;

/*
 * Matches a value against linkStoragePattern, returning the first mismatch or null.
 */
export const matchLinkStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: linkStoragePattern });
};

export const isLinkStorage = (storage: unknown): storage is LinkStorage => {
	const mismatch = matchLinkStorage(storage);

	return !mismatch;
};

export const validateLinkStorage = (storage: unknown): storage is LinkStorage => {
	return validateStorage(storage, isLinkStorage);
};

export const createLinkStorage = (): CreateLinkStorageResult => ({
	id: linkId,
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
