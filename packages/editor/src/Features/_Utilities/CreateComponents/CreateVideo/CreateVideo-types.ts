import type { BlockComponentLine } from "@rangex/core";

import type { VideoAttrs } from "#dom-attrs";
import type { FileId } from "#storage";

export interface CreateVideoParams {
  attrs: VideoAttrs;
  fileId: FileId;
}

export type CreateVideoResult = BlockComponentLine;
