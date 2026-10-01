import type {
	GetMentionItemsParams,
	MentionExtensionSettings,
} from "@rangex/rich-text-editor/mention";
import { mentionItems } from "../../DemoData/MentionItems";

/**
 * Demo-only stand-in for a user search — filters the mock users locally. A consumer building a real editor should
 * replace this with a request to their own user directory, passing `signal` along so stale requests get cancelled.
 */
const getMentionItems = async ({ query }: GetMentionItemsParams) => {
	const lowerQuery = query.toLowerCase();

	return mentionItems.filter((item) => {
		const displayName = item.displayName || item.userId;

		return displayName.toLowerCase().includes(lowerQuery);
	});
};

export const mentionSettings: MentionExtensionSettings = {
	getItems: getMentionItems,
};
