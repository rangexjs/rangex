import type { InlineComponent } from "@rangex/core";
import type { MentionId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export type MentionStorage = {
	id: MentionId;
	version: typeof storageVersion;
	userId: string;
};

export interface CreateMentionStorageParams {
	userId: string;
}

export type CreateMentionStorageResult = MentionStorage;

export interface MentionStorageFallbacks {
	userId: string;
}

export interface EnsureMentionStorageParams {
	storage: unknown;
	fallbacks: MentionStorageFallbacks;
}

export type EnsureMentionStorageResult = MentionStorage;

export interface EnsureNodeMentionStorageParams {
	inlineComponent: InlineComponent;
	fallbacks: MentionStorageFallbacks;
}

export type EnsureNodeMentionStorageResult = MentionStorage;
