import type { LoadMentionItemsParams } from "./LoadMentionItems-types";
import { mentionItems } from "./MentionItems";

/**
 * Loads all mention items into the popover state. Call once on initialization.
 */
export const loadMentionItems = ({ mentionPort }: LoadMentionItemsParams) => {
	mentionPort.updateState({ items: mentionItems });
};
