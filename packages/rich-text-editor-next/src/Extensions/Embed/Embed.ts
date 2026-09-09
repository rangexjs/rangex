import { Embed as EmbedFactory } from "@rangex/editor";
import { EmbedQuickActions } from "#features";
import type { Extension } from "../_Utilities";

export const Embed = (
	...adapterSettings: Parameters<typeof EmbedFactory>
): Extension => {
	return {
		createAdapter: () => EmbedFactory(...adapterSettings),
		components: {
			toolbarButtons: {},
			floatingComponents: [EmbedQuickActions],
		},
	};
};
