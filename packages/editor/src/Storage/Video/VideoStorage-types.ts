import type { BlockComponent } from "@rangex/core";

import type { VideoId } from "../_Constants";
import type { FileId } from "../_Utilities";

export type VideoStorage = {
  id: VideoId;
  fileId: FileId;
};

export interface CreateVideoStorageParams {
  fileId: FileId;
}

export type CreateVideoStorageResult = VideoStorage;

export interface EnsureVideoStorageParams {
  storage: unknown;
}

export type EnsureVideoStorageResult = VideoStorage;

export interface EnsureNodeVideoStorageParams {
  blockComponent: BlockComponent;
}

export type EnsureNodeVideoStorageResult = VideoStorage;
