import { linkId } from "../../../Constants";
import type {
	CreateLinkStorageResult,
	EnsureNodeLinkStorageParams,
	EnsureNodeLinkStorageResult,
	LinkStorage,
} from "./LinkStorage-types";

export const linkStorageVersion = 1 as const;

export const isLinkStorage = (storage: unknown): storage is LinkStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === linkId &&
	"version" in storage &&
	storage.version === linkStorageVersion;

export const validateLinkStorage = (
	storage: unknown,
): storage is LinkStorage => {
	const isValid = isLinkStorage(storage);

	if (!isValid) {
		console.warn("validateLinkStorage: unexpected data shape", storage);
	}

	return isValid;
};

export const createLinkStorage = (): CreateLinkStorageResult => {
	return { id: linkId, version: linkStorageVersion };
};

export const ensureNodeLinkStorage = ({
	inlineNestedContext,
}: EnsureNodeLinkStorageParams): EnsureNodeLinkStorageResult => {
	const { $$customStorage } = inlineNestedContext;

	if (validateLinkStorage($$customStorage)) {
		return $$customStorage;
	}

	const storage = createLinkStorage();
	inlineNestedContext.$$customStorage = storage;

	return storage;
};
