import { rootId } from "../../Constants";
import type {
	CreateRootStorageResult,
	EnsureRootStorageParams,
	EnsureRootStorageResult,
	RootStorage,
} from "./RootStorage-types";

export const rootStorageVersion = 1 as const;

export const isRootStorage = (storage: unknown): storage is RootStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === rootId &&
	"version" in storage &&
	storage.version === rootStorageVersion;

export const validateRootStorage = (
	storage: unknown,
): storage is RootStorage => {
	const isValid = isRootStorage(storage);

	if (!isValid) {
		console.warn("validateRootStorage: unexpected data shape", storage);
	}

	return isValid;
};

export const createRootStorage = (): CreateRootStorageResult => ({
	id: rootId,
	version: rootStorageVersion,
	templateVariable: {},
});

export const ensureRootStorage = ({
	rootEditable,
}: EnsureRootStorageParams): EnsureRootStorageResult => {
	const { $$customStorage } = rootEditable;

	if (validateRootStorage($$customStorage)) {
		return $$customStorage;
	}

	const storage = createRootStorage();
	rootEditable.$$customStorage = storage;

	return storage;
};
