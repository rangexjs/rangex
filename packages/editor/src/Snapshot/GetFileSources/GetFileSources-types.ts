import type { BlockComponentDraft, StoredSnapshot } from "@rangex/core";

import type { MediaType } from "#adapters";
import type { AudioStorage, FileId, ImageStorage, VideoStorage } from "#storage";

export type FileStorage = ImageStorage | VideoStorage | AudioStorage;

export interface FileSource {
  type: MediaType;
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
