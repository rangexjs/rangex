import { codeBlockId } from "../../Constants";
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

export const codeBlockStorageVersion = 1 as const;

export const isCodeBlockStorage = (
	storage: unknown,
): storage is CodeBlockStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === codeBlockId &&
	"version" in storage &&
	storage.version === codeBlockStorageVersion;

export const validateCodeBlockStorage = (
	storage: unknown,
): storage is CodeBlockStorage => {
	const isValid = isCodeBlockStorage(storage);

	if (!isValid) {
		console.warn("validateCodeBlockStorage: unexpected data shape", storage);
	}

	return isValid;
};

export const codeBlockStorageFallbacks: CodeBlockStorageFallbacks = {
	lang: "typescript",
	theme: { light: "light-plus", dark: "dark-plus" },
};

export const createCodeBlockStorage = ({
	lang,
	theme,
}: CreateCodeBlockStorageParams): CreateCodeBlockStorageResult => ({
	id: codeBlockId,
	version: codeBlockStorageVersion,
	lang,
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
	blockNestedContext,
	fallbacks,
}: EnsureNodeCodeBlockStorageParams): EnsureNodeCodeBlockStorageResult => {
	const { $$customStorage } = blockNestedContext;

	const storage = ensureCodeBlockStorage({
		storage: $$customStorage,
		fallbacks,
	});
	blockNestedContext.$$customStorage = storage;

	return storage;
};
