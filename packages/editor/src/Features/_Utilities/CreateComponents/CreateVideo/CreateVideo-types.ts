import type { BlockComponentLine } from "@rangex/core";

import type { VideoAttrs } from "#dom-attrs";

export interface CreateVideoParams {
	attrs: VideoAttrs;
}

export type CreateVideoResult = BlockComponentLine;
