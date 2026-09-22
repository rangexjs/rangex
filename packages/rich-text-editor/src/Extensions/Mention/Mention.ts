import { Mention as MentionFactory } from "@rangex/editor";
import { MentionCaretMenu } from "#features";
import type { Extension } from "../_Utilities";

export const Mention = (
	...adapterSettings: Parameters<typeof MentionFactory>
): Extension => {
	return {
		createAdapter: () => MentionFactory(...adapterSettings),
		components: {
			toolbarButtons: {},
			floatingComponents: [MentionCaretMenu],
		},
	};
};
