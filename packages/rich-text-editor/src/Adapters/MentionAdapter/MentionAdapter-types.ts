import type { MentionItems } from "#ports";

export interface MentionAdapterConstructorParams {
	[index: string]: never;
}

export type MentionUpdateItemsFn = (value: MentionItems) => void;
export type MentionUpdateQueryFn = (value: string) => void;
export type MentionUpdateFilteredItemsFn = (value: MentionItems) => void;

export type MentionListenerOption =
	| { type: "items"; callback: MentionUpdateItemsFn }
	| { type: "query"; callback: MentionUpdateQueryFn }
	| { type: "filteredItems"; callback: MentionUpdateFilteredItemsFn };

export type MentionUpdateListenerParams = MentionListenerOption & {
	operation: "add" | "delete";
};
