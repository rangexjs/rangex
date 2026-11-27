import type { BlockComponentLine } from "@rangex/core";

import type { ImageAttrs } from "#dom-attrs";
import type { FileId } from "#storage";

export interface CreateImageParams {
  attrs: ImageAttrs;
  fileId: FileId;
}

export type CreateImageResult = BlockComponentLine;
