import { htmlLayoutRole, snapshotManager } from "@rangex/core";

import type { GetFileSourcesParams, GetFileSourcesResult } from "./GetFileSources-types";

const fileLocalNames = ["audio", "img", "video"];

/*
 * Returns the src of every audio, image and video element in the StoredSnapshot, each once, in order of first
 * appearance: the files the snapshot uses. The snapshot isn't validated here: pass one returned by validateSnapshot.
 */
export const getFileSources = ({ storedSnapshot }: GetFileSourcesParams): GetFileSourcesResult => {
  const rootEditableDraft = snapshotManager.createDraftFromSnapshot(storedSnapshot.snapshot);

  const fileElements = rootEditableDraft.queryAll((node) => {
    if (node.editorRole !== htmlLayoutRole) {
      return false;
    }

    const { localName } = node;

    if (!fileLocalNames.includes(localName)) {
      return false;
    }

    return true;
  });

  const sources = new Set<string>();

  for (const fileElement of fileElements) {
    if (fileElement.editorRole !== htmlLayoutRole) {
      throw new Error("FileElement's editorRole is invalid.");
    }

    const { src } = fileElement.domAttrs;

    if (!src) {
      console.warn("src attribute is missing.");
      continue;
    }

    sources.add(src);
  }

  return [...sources];
};
