import type { InlineNestedContext } from "rich-text-area";

export interface CreateMentionParams {
	userId: string;
	name: string;
}

export type CreateMentionResult = InlineNestedContext;
