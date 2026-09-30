import type { BlockComponent } from "rich-text-area";
import type { ImageId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export interface ImageStorage {
	id: ImageId;
	version: typeof storageVersion;
}

export interface CreateImageStorageResult extends ImageStorage {}

export interface EnsureImageStorageParams {
	storage: unknown;
}

export interface EnsureImageStorageResult extends ImageStorage {}

export interface EnsureNodeImageStorageParams {
	blockComponent: BlockComponent;
}

export interface EnsureNodeImageStorageResult extends ImageStorage {}
