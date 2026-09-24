import { codeBlockId } from "../../Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	CodeBlockStorage,
	CodeBlockStorageFallbacks,
	CreateCodeBlockStorageParams,
	CreateCodeBlockStorageResult,
	EnsureCodeBlockStorageParams,
	EnsureCodeBlockStorageResult,
	EnsureNodeCodeBlockStorageParams,
	EnsureNodeCodeBlockStorageResult,
} from "./CodeBlockStorage-types";

export const isCodeBlockStorage = (
	storage: unknown,
): storage is CodeBlockStorage => {
	return isStorage(storage, { id: codeBlockId });
};

export const validateCodeBlockStorage = (
	storage: unknown,
): storage is CodeBlockStorage => {
	return validateStorage(storage, isCodeBlockStorage);
};

export const codeBlockStorageFallbacks: CodeBlockStorageFallbacks = {
	language: null,
	theme: null,
};

export const createCodeBlockStorage = ({
	language,
	theme,
}: CreateCodeBlockStorageParams): CreateCodeBlockStorageResult => ({
	id: codeBlockId,
	version: storageVersion,
	language,
	theme,
});

export const ensureCodeBlockStorage = ({
	storage,
	fallbacks,
}: EnsureCodeBlockStorageParams): EnsureCodeBlockStorageResult => {
	if (validateCodeBlockStorage(storage)) {
		return storage;
	}

	return createCodeBlockStorage(fallbacks);
};

export const ensureNodeCodeBlockStorage = ({
	blockComponent,
	fallbacks,
}: EnsureNodeCodeBlockStorageParams): EnsureNodeCodeBlockStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureCodeBlockStorage({
		storage: $$customStorage,
		fallbacks,
	});
	blockComponent.$$customStorage = storage;

	return storage;
};
