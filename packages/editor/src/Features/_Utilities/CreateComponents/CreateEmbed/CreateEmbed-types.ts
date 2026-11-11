import type { BlockComponentLine } from "@rangex/core";
import type { EmbedAttrs } from "#dom-attrs";

export interface CreateEmbedParams {
	attrs: EmbedAttrs;
}

export type CreateEmbedResult = BlockComponentLine;
