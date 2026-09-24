import type { BlockComponent } from "rich-text-area";
import type { AudioId } from "../../Constants";
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
