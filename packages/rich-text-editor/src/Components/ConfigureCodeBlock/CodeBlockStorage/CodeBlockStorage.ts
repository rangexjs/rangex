import { codeBlockId } from "../../../Constants";
import type {
	CodeBlockStorage,
	CreateCodeBlockStorageParams,
	CreateCodeBlockStorageResult,
	EnsureCodeBlockStorageResult,
	EnsureNodeCodeBlockStorageParams,
	EnsureNodeCodeBlockStorageResult,
} from "./CodeBlockStorage-types";

export const validateCodeBlockStorage = (
	storage: unknown,
): storage is CodeBlockStorage => {
	const isValid =
		typeof storage === "object" &&
		storage !== null &&
		"id" in storage &&
		storage.id === codeBlockId;

	if (!isValid) {
		console.warn("Invalid CodeBlockStorage.", storage);
	}

	return isValid;
};

export const createCodeBlockStorage = ({
	lang,
	theme,
}: CreateCodeBlockStorageParams): CreateCodeBlockStorageResult => {
	return { id: codeBlockId, lang, theme };
};

export const ensureCodeBlockStorage = (
	storage: unknown,
): EnsureCodeBlockStorageResult => {
	if (validateCodeBlockStorage(storage)) {
		return storage;
	}

	return createCodeBlockStorage({
		lang: "typescript",
		theme: { light: "light-plus", dark: "dark-plus" },
	});
};

export const ensureNodeCodeBlockStorage = ({
	blockNestedContext,
}: EnsureNodeCodeBlockStorageParams): EnsureNodeCodeBlockStorageResult => {
	const { $$customStorage } = blockNestedContext;

	if (validateCodeBlockStorage($$customStorage)) {
		return $$customStorage;
	}

	blockNestedContext.$$customStorage = createCodeBlockStorage({
		lang: "typescript",
		theme: { light: "light-plus", dark: "dark-plus" },
	});

	return blockNestedContext.$$customStorage;
};
