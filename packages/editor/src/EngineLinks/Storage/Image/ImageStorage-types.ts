import type { BlockComponent } from "rich-text-area";
import type { ImageId } from "../../Constants";
import type { imageStorageVersion } from "./ImageStorage";

export interface ImageStorage {
	id: ImageId;
	version: typeof imageStorageVersion;
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
