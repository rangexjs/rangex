import type { InlineComponent } from "@rangex/core";

export interface CreateLinkParams {
	text: string;
	href?: string;
	target?: string;
}

export type CreateLinkResult = InlineComponent;
