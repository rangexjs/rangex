import type { InlineComponent } from "rich-text-area";

export interface CreateMentionParams {
	userId: string;
	displayName: string;
}

export type CreateMentionResult = InlineComponent;
