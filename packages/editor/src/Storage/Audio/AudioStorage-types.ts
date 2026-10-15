import type { BlockComponent } from "@rangex/core";
import type { AudioId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export type AudioStorage = {
	id: AudioId;
	version: typeof storageVersion;
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
