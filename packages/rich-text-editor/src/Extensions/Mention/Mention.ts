import { Mention as MentionFactory } from "@rangex/editor/mention";
import type { MentionUIOptions } from "#context";
import { MentionCaretMenu } from "#features";
import type { Extension } from "../_Utilities";

export const Mention = (
	settings: Parameters<typeof MentionFactory>[0] & MentionUIOptions,
): Extension => {
	const { getItems, ...adapterSettings } = settings;

	return {
		createAdapter: () => MentionFactory(adapterSettings),
		components: {
			toolbarButtons: {},
			floatingComponents: [MentionCaretMenu],
		},
		uiOptions: {
			mention: { getItems },
		},
	};
};
