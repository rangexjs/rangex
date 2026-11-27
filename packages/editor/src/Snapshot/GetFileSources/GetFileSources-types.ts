import type { BlockComponentDraft, StoredSnapshot } from "@rangex/core";

import type { componentsName } from "#constants";
import type { AudioStorage, FileId, ImageStorage, VideoStorage } from "#storage";

export type FileType =
  | typeof componentsName.image
  | typeof componentsName.video
  | typeof componentsName.audio;

export type FileStorage = ImageStorage | VideoStorage | AudioStorage;

export interface FileSource {
  type: FileType;
  src: string;
  fileId: FileId;
}

export interface GetMediaSrcParams {
  blockComponentDraft: BlockComponentDraft;
  mediaLocalName: string;
}

export type GetMediaSrcResult = string | null;

export interface GetFileSourcesParams {
  storedSnapshot: StoredSnapshot;
}

export type GetFileSourcesResult = FileSource[];
