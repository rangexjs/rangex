import type { BlockComponent } from "rich-text-area";
import type { VideoId } from "../../Constants";
import type { videoStorageVersion } from "./VideoStorage";

export interface VideoStorage {
	id: VideoId;
	version: typeof videoStorageVersion;
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
