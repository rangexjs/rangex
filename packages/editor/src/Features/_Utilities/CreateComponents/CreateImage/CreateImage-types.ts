import type { BlockComponentLine } from "@rangex/core";
import type { ImageAttrs } from "#dom-attrs";

export interface CreateImageParams {
	attrs: ImageAttrs;
}

export type CreateImageResult = BlockComponentLine;
