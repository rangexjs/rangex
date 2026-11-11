import { type JSONPattern, matchJSON } from "#utilities";
import { mentionId } from "../_Constants";
import { validateStorage } from "../_Utilities";
import type {
	CreateMentionStorageParams,
	CreateMentionStorageResult,
	EnsureMentionStorageParams,
	EnsureMentionStorageResult,
	EnsureNodeMentionStorageParams,
	EnsureNodeMentionStorageResult,
	MentionStorage,
} from "./MentionStorage-types";

/*
 * A user id is valid if it isn't empty and it's at most 1024 characters long.
 */
export const isUserId = (value: unknown) => {
	const maxUserIdLength = 1024;

	return (
		typeof value === "string" && value !== "" && value.length <= maxUserIdLength
	);
};

/*
 * The Mention's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const mentionStoragePattern = {
	id: mentionId,
	userId: isUserId,
} satisfies JSONPattern<MentionStorage>;

/*
 * Matches a value against mentionStoragePattern, returning the first mismatch or null.
 */
export const matchMentionStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: mentionStoragePattern });
};

export const isMentionStorage = (
	storage: unknown,
): storage is MentionStorage => {
	const mismatch = matchMentionStorage(storage);

	return !mismatch;
};

export const validateMentionStorage = (
	storage: unknown,
): storage is MentionStorage => {
	return validateStorage(storage, isMentionStorage);
};

export const createMentionStorage = ({
	userId,
}: CreateMentionStorageParams): CreateMentionStorageResult => {
	return { id: mentionId, userId };
};

export const ensureMentionStorage = ({
	storage,
	fallbacks,
}: EnsureMentionStorageParams): EnsureMentionStorageResult => {
	if (validateMentionStorage(storage)) {
		return storage;
	}

	return createMentionStorage(fallbacks);
};

export const ensureNodeMentionStorage = ({
	inlineComponent,
	fallbacks,
}: EnsureNodeMentionStorageParams): EnsureNodeMentionStorageResult => {
	const { $$customStorage } = inlineComponent;

	const storage = ensureMentionStorage({ storage: $$customStorage, fallbacks });
	inlineComponent.$$customStorage = storage;

	return storage;
};
