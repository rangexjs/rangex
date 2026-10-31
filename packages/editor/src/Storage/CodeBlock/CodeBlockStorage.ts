import { type JSONPattern, matchJSON } from "#utilities";
import { codeBlockId } from "../_Constants";
import { validateStorage } from "../_Utilities";
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

/*
 * A language or theme name is valid if it's at most 64 characters long.
 */
const isName = (value: unknown) => {
	const maxNameLength = 64;

	return typeof value === "string" && value.length <= maxNameLength;
};

const isLanguage = (value: unknown) => value === null || isName(value);

/*
 * A theme is valid if it's null, or a light and a dark theme name.
 */
const isTheme = (value: unknown) => {
	if (value === null) {
		return true;
	}

	const mismatch = matchJSON({
		value,
		pattern: { light: isName, dark: isName },
	});

	return !mismatch;
};

/*
 * The CodeBlock's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const codeBlockStoragePattern = {
	id: codeBlockId,
	language: isLanguage,
	theme: isTheme,
} satisfies JSONPattern<CodeBlockStorage>;

/*
 * Matches a value against codeBlockStoragePattern, returning the first mismatch or null.
 */
export const matchCodeBlockStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: codeBlockStoragePattern });
};

export const isCodeBlockStorage = (
	storage: unknown,
): storage is CodeBlockStorage => {
	const mismatch = matchCodeBlockStorage(storage);

	return !mismatch;
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
