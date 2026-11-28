import { blockComponentRole, htmlLayoutRole, snapshotManager } from "@rangex/core";

import type { MediaType } from "#adapters";
import { componentsName } from "#constants";
import { isAudioStorage, isImageStorage, isVideoStorage } from "#storage";

import type {
  FileSource,
  FileStorage,
  GetFileSourcesParams,
  GetFileSourcesResult,
  GetMediaSrcParams,
  GetMediaSrcResult,
} from "./GetFileSources-types";

const mediaLocalNamesByType = {
  [componentsName.image]: "img",
  [componentsName.video]: "video",
  [componentsName.audio]: "audio",
} satisfies Record<MediaType, string>;

const isMediaType = (name: string): name is MediaType => {
  const isValid = Object.hasOwn(mediaLocalNamesByType, name);

  return isValid;
};

const isFileStorage = (storage: unknown): storage is FileStorage => {
  const isValid = isImageStorage(storage) || isVideoStorage(storage) || isAudioStorage(storage);

  return isValid;
};

/*
 * Returns the src of the media component's media element, or null if it has none.
 */
const getMediaSrc = ({
  blockComponentDraft,
  mediaLocalName,
}: GetMediaSrcParams): GetMediaSrcResult => {
  const mediaElement = blockComponentDraft.query((node) => {
    if (node.editorRole !== htmlLayoutRole) {
      return false;
    }

    return node.localName === mediaLocalName;
  });

  if (mediaElement?.editorRole !== htmlLayoutRole) {
    return null;
  }

  const { src } = mediaElement.domAttrs;

  if (!src) {
    return null;
  }

  return src;
};

/*
 * Returns every file the StoredSnapshot uses: the type and src of each Image, Video and Audio, with the file id their
 * storage holds (null when the media isn't an uploaded file). Each type, src and file id combination is returned once,
 * in order of first appearance. The snapshot isn't validated here: pass one returned by validateSnapshot.
 */
export const getFileSources = ({ storedSnapshot }: GetFileSourcesParams): GetFileSourcesResult => {
  const rootEditableDraft = snapshotManager.createDraftFromSnapshot(storedSnapshot.snapshot);

  const mediaComponents = rootEditableDraft.queryAll((node) => {
    if (node.editorRole !== blockComponentRole) {
      return false;
    }

    return isMediaType(node.name);
  });

  const fileSourcesByKey = new Map<string, FileSource>();

  for (const blockComponentDraft of mediaComponents) {
    if (blockComponentDraft.editorRole !== blockComponentRole) {
      throw new Error("MediaComponent's editorRole is invalid.");
    }

    const type = blockComponentDraft.name;

    if (!isMediaType(type)) {
      throw new Error("MediaComponent's name is invalid.");
    }

    const mediaLocalName = mediaLocalNamesByType[type];
    const { customStorage } = blockComponentDraft;

    if (!isFileStorage(customStorage)) {
      throw new Error("MediaComponent's customStorage is invalid.");
    }

    const src = getMediaSrc({ blockComponentDraft, mediaLocalName });

    if (!src) {
      console.warn("src attribute is missing.");
      continue;
    }

    const { fileId } = customStorage;
    const key = JSON.stringify([type, src, fileId]);

    if (!fileSourcesByKey.has(key)) {
      fileSourcesByKey.set(key, { type, src, fileId });
    }
  }

  return [...fileSourcesByKey.values()];
};
