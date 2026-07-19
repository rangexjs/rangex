import type { LoadMentionItemsParams } from "./LoadMentionItems-types";
import { mentionItems } from "./MentionItems";

/**
 * Loads all mention items into the popover state. Call once on initialization.
 */
export const loadMentionItems = ({ editorPort }: LoadMentionItemsParams) => {
	editorPort.updateState({ items: mentionItems });
};
