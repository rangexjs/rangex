import type { BlockComponent } from "@rangex/core";

import type { ImageId } from "../_Constants";
import type { FileId } from "../_Utilities";

export type ImageStorage = {
  id: ImageId;
  fileId: FileId;
};

export interface CreateImageStorageParams {
  fileId: FileId;
}

export type CreateImageStorageResult = ImageStorage;

export interface EnsureImageStorageParams {
  storage: unknown;
}

export type EnsureImageStorageResult = ImageStorage;

export interface EnsureNodeImageStorageParams {
  blockComponent: BlockComponent;
}

export type EnsureNodeImageStorageResult = ImageStorage;
