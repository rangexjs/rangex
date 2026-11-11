import type { InlineComponent } from "@rangex/core";

import type { LinkAttrs } from "#dom-attrs";

export interface CreateLinkParams {
	text: string;
	attrs: LinkAttrs;
}

export type CreateLinkResult = InlineComponent;
