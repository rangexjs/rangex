import { mentionId } from "../../../Constants";
import type {
	CreateMentionStorageParams,
	CreateMentionStorageResult,
	EnsureNodeMentionStorageParams,
	EnsureNodeMentionStorageResult,
	MentionStorage,
} from "./MentionStorage-types";

export const mentionStorageVersion = 1 as const;

export const isMentionStorage = (storage: unknown): storage is MentionStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === mentionId &&
	"version" in storage &&
	storage.version === mentionStorageVersion;

export const validateMentionStorage = (
	storage: unknown,
): storage is MentionStorage => {
	const isValid = isMentionStorage(storage);

	if (!isValid) {
		console.warn("validateMentionStorage: unexpected data shape", storage);
	}

	return isValid;
};

export const createMentionStorage = ({
	userId,
}: CreateMentionStorageParams): CreateMentionStorageResult => {
	return { id: mentionId, version: mentionStorageVersion, userId };
};

export const ensureNodeMentionStorage = ({
	inlineNestedContext,
	fallbacks,
}: EnsureNodeMentionStorageParams): EnsureNodeMentionStorageResult => {
	const { $$customStorage } = inlineNestedContext;

	if (validateMentionStorage($$customStorage)) {
		return $$customStorage;
	}

	const storage = createMentionStorage({ userId: fallbacks.userId });
	inlineNestedContext.$$customStorage = storage;

	return storage;
};
