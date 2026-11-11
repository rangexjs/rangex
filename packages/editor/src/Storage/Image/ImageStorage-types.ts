import type { BlockComponent } from "@rangex/core";
import type { ImageId } from "../_Constants";

export type ImageStorage = {
	id: ImageId;
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
