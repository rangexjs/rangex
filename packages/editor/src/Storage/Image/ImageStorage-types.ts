import type { BlockComponent } from "@rangex/core";
import type { ImageId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export type ImageStorage = {
	id: ImageId;
	version: typeof storageVersion;
};

export type CreateImageStorageResult = ImageStorage;

export interface EnsureImageStorageParams {
	storage: unknown;
}

export type EnsureImageStorageResult = ImageStorage;

export interface EnsureNodeImageStorageParams {
	blockComponent: BlockComponent;
}

export type EnsureNodeImageStorageResult = ImageStorage;
