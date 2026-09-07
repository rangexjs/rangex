import type { InlineComponent } from "rich-text-area";

export interface CreateLinkParams {
	text: string;
	href: string;
	target: string;
}

export type CreateLinkResult = InlineComponent;
