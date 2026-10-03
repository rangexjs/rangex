import type { BlockComponent } from "@rangex/core";
import type { AudioId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export interface AudioStorage {
	id: AudioId;
	version: typeof storageVersion;
}

export interface CreateAudioStorageResult extends AudioStorage {}

export interface EnsureAudioStorageParams {
	storage: unknown;
}

export interface EnsureAudioStorageResult extends AudioStorage {}

export interface EnsureNodeAudioStorageParams {
	blockComponent: BlockComponent;
}

export interface EnsureNodeAudioStorageResult extends AudioStorage {}
