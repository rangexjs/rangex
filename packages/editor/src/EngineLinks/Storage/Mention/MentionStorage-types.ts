import type { InlineComponent } from "rich-text-area";
import type { MentionId } from "../../Constants";
import type { storageVersion } from "../_Utilities";

export interface MentionStorage {
	id: MentionId;
	version: typeof storageVersion;
	userId: string;
}

export interface CreateMentionStorageParams {
	userId: string;
}

export interface CreateMentionStorageResult extends MentionStorage {}

export interface MentionStorageFallbacks {
	userId: string;
}

export interface EnsureMentionStorageParams {
	storage: unknown;
	fallbacks: MentionStorageFallbacks;
}

export interface EnsureMentionStorageResult extends MentionStorage {}

export interface EnsureNodeMentionStorageParams {
	inlineComponent: InlineComponent;
	fallbacks: MentionStorageFallbacks;
}

export interface EnsureNodeMentionStorageResult extends MentionStorage {}
