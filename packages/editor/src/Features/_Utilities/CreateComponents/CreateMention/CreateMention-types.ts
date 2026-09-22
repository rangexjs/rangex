import type { InlineComponent } from "rich-text-area";

export interface CreateMentionParams {
	userId: string;
	name: string;
}

export type CreateMentionResult = InlineComponent;
