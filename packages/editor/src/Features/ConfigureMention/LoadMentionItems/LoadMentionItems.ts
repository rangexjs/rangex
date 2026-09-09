import type { LoadMentionItemsParams } from "./LoadMentionItems-types";
import { mentionItems } from "./MentionItems";

/**
 * Loads all mention items into the adapter's state. Call once on initialization.
 */
export const loadMentionItems = ({ configPort }: LoadMentionItemsParams) => {
	configPort.updateState({ items: mentionItems });
};
