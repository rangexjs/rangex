import type { InlineComponent } from "@rangex/core";

export interface CreateMentionParams {
	userId: string;
	displayName: string;
}

export type CreateMentionResult = InlineComponent;
