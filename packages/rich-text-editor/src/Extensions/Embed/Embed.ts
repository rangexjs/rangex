import { Embed as EmbedFactory } from "@rangex/editor/embed";
import { EmbedQuickActions } from "#features";
import type { Extension } from "../_Utilities";
import type { EmbedExtensionSettings } from "./Embed-types";

export const Embed = (settings: EmbedExtensionSettings): Extension => {
	return {
		createAdapter: () => EmbedFactory(settings),
		components: {
			toolbarButtons: {},
			floatingComponents: [EmbedQuickActions],
		},
	};
};
