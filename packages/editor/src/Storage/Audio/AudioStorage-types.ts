import type { BlockComponent } from "@rangex/core";

import type { AudioId } from "../_Constants";

export type AudioStorage = {
	id: AudioId;
};

export type CreateAudioStorageResult = AudioStorage;

export interface EnsureAudioStorageParams {
	storage: unknown;
}

export type EnsureAudioStorageResult = AudioStorage;

export interface EnsureNodeAudioStorageParams {
	blockComponent: BlockComponent;
}

export type EnsureNodeAudioStorageResult = AudioStorage;
