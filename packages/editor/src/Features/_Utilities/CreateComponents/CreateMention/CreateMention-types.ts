import type { InlineComponent } from "@rangex/core";

export interface CreateMentionParams {
	userId: string;
	displayText: string;
}

export type CreateMentionResult = InlineComponent;
