import type { BlockComponent } from "@rangex/core";

import type { VideoId } from "../_Constants";

export type VideoStorage = {
	id: VideoId;
};

export type CreateVideoStorageResult = VideoStorage;

export interface EnsureVideoStorageParams {
	storage: unknown;
}

export type EnsureVideoStorageResult = VideoStorage;

export interface EnsureNodeVideoStorageParams {
	blockComponent: BlockComponent;
}

export type EnsureNodeVideoStorageResult = VideoStorage;
