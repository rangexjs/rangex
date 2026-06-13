import type {
	CodeBlockStorage,
	CreateCodeBlockStorageParams,
	CreateCodeBlockStorageResult,
	EnsureCodeBlockStorageParams,
	EnsureCodeBlockStorageResult,
} from "./CodeBlockStorage-types";

export const createCodeBlockStorage = ({
	lang,
	theme,
}: CreateCodeBlockStorageParams): CreateCodeBlockStorageResult => {
	return { id: "code-block", lang, theme };
};

export const ensureCodeBlockStorage = ({
	blockNestedContext,
}: EnsureCodeBlockStorageParams): EnsureCodeBlockStorageResult => {
	const { $$customStorage } = blockNestedContext;

	if ("id" in $$customStorage && $$customStorage.id === "code-block") {
		return $$customStorage as CodeBlockStorage;
	}

	blockNestedContext.$$customStorage = createCodeBlockStorage({
		lang: "typescript",
		theme: { light: "light-plus", dark: "dark-plus" },
	});

	return blockNestedContext.$$customStorage;
};
