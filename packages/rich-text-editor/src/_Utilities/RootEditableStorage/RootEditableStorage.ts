import type {
	EnsureRootEditableStorageParams,
	EnsureRootEditableStorageResult,
	RootEditableStorage,
} from "./RootEditableStorage-types";

export const ensureRootEditableStorage = ({
	rootEditable,
}: EnsureRootEditableStorageParams): EnsureRootEditableStorageResult => {
	rootEditable.$$customStorage ??= {};

	const storage = rootEditable.$$customStorage as Partial<RootEditableStorage>;

	storage.templateVariable ??= {};

	return storage as EnsureRootEditableStorageResult;
};
