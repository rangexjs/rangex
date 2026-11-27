import { type JSONPattern, matchJSON } from "#utilities";

import { videoId } from "../_Constants";
import { isFileId, validateStorage } from "../_Utilities";
import type {
  CreateVideoStorageParams,
  CreateVideoStorageResult,
  EnsureNodeVideoStorageParams,
  EnsureNodeVideoStorageResult,
  EnsureVideoStorageParams,
  EnsureVideoStorageResult,
  VideoStorage,
} from "./VideoStorage-types";

/*
 * The Video's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const videoStoragePattern = {
  id: videoId,
  fileId: isFileId,
} satisfies JSONPattern<VideoStorage>;

/*
 * Matches a value against videoStoragePattern, returning the first mismatch or null.
 */
export const matchVideoStorage = (storage: unknown) => {
  return matchJSON({ value: storage, pattern: videoStoragePattern });
};

export const isVideoStorage = (storage: unknown): storage is VideoStorage => {
  const mismatch = matchVideoStorage(storage);

  return !mismatch;
};

export const validateVideoStorage = (storage: unknown): storage is VideoStorage => {
  return validateStorage(storage, isVideoStorage);
};

export const createVideoStorage = ({
  fileId,
}: CreateVideoStorageParams): CreateVideoStorageResult => ({
  id: videoId,
  fileId,
});

export const ensureVideoStorage = ({
  storage,
}: EnsureVideoStorageParams): EnsureVideoStorageResult => {
  if (validateVideoStorage(storage)) {
    return storage;
  }

  return createVideoStorage({ fileId: null });
};

export const ensureNodeVideoStorage = ({
  blockComponent,
}: EnsureNodeVideoStorageParams): EnsureNodeVideoStorageResult => {
  const { $$customStorage } = blockComponent;

  const storage = ensureVideoStorage({ storage: $$customStorage });
  blockComponent.$$customStorage = storage;

  return storage;
};
