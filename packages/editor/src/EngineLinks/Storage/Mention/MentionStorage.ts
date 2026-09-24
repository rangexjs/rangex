import { mentionId } from "../../Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	CreateMentionStorageParams,
	CreateMentionStorageResult,
	EnsureMentionStorageParams,
	EnsureMentionStorageResult,
	EnsureNodeMentionStorageParams,
	EnsureNodeMentionStorageResult,
	MentionStorage,
} from "./MentionStorage-types";

export const isMentionStorage = (
	storage: unknown,
): storage is MentionStorage => {
	return isStorage(storage, { id: mentionId });
};

export const validateMentionStorage = (
	storage: unknown,
): storage is MentionStorage => {
	return validateStorage(storage, isMentionStorage);
};

export const createMentionStorage = ({
	userId,
}: CreateMentionStorageParams): CreateMentionStorageResult => {
	return { id: mentionId, version: storageVersion, userId };
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
