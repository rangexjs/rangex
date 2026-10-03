import type { BlockComponent } from "@rangex/core";
import type { VideoId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export interface VideoStorage {
	id: VideoId;
	version: typeof storageVersion;
}

export interface CreateVideoStorageResult extends VideoStorage {}

export interface EnsureVideoStorageParams {
	storage: unknown;
}

export interface EnsureVideoStorageResult extends VideoStorage {}

export interface EnsureNodeVideoStorageParams {
	blockComponent: BlockComponent;
}

export interface EnsureNodeVideoStorageResult extends VideoStorage {}
