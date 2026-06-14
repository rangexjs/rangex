import type { LoadMentionItemsParams } from "./LoadMentionItems-types";
import { mentionItems } from "./MentionItems";

/**
 * Loads all mention items into the popover state. Call once on initialization.
 */
export const loadMentionItems = ({
	richTextEditorUI,
}: LoadMentionItemsParams) => {
	const { mentionPopover } = richTextEditorUI;

	mentionPopover.updateState({ items: mentionItems });
};
