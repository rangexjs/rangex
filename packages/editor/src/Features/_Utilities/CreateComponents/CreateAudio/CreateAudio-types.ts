import type { BlockComponentLine } from "@rangex/core";

import type { AudioAttrs } from "#dom-attrs";
import type { FileId } from "#storage";

export interface CreateAudioParams {
  attrs: AudioAttrs;
  fileId: FileId;
}

export type CreateAudioResult = BlockComponentLine;
