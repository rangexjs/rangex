import type { EmojiItems } from "#ports";

export type EmojiUpdateQueryFn = (value: string) => void;
export type EmojiUpdateFilteredItemsFn = (value: EmojiItems) => void;

export type EmojiListenerOption =
	| { type: "query"; callback: EmojiUpdateQueryFn }
	| { type: "filteredItems"; callback: EmojiUpdateFilteredItemsFn };

export type EmojiUpdateListenerParams = EmojiListenerOption & {
	operation: "add" | "delete";
};
