import { Audio as AudioFactory } from "@rangex/editor";
import { AudioQuickActions } from "#features";
import type { Extension } from "../_Utilities";

export const Audio = (
	...adapterSettings: Parameters<typeof AudioFactory>
): Extension => {
	return {
		createAdapter: () => AudioFactory(...adapterSettings),
		components: {
			toolbarButtons: {},
			floatingComponents: [AudioQuickActions],
		},
	};
};
