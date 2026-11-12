import { Mention as MentionFactory } from "@rangex/editor/mention";

import { MentionCaretMenu } from "#features";

import type { Extension } from "../_Utilities";
import type { MentionExtensionSettings } from "./Mention-types";

export const Mention = (settings: MentionExtensionSettings): Extension => {
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
