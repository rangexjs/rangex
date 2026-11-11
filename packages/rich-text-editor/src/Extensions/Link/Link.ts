import { Link as LinkFactory } from "@rangex/editor/link";

import { toolbarButtonsName } from "#constants";
import { LinkMenu, LinkSelectionMenu, LinkToolbarButton } from "#features";

import type { Extension } from "../_Utilities";
import type { LinkExtensionSettings } from "./Link-types";

export const Link = (settings: LinkExtensionSettings): Extension => {
	return {
		createAdapter: () => LinkFactory(settings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.link]: LinkToolbarButton,
			},
			floatingComponents: [LinkSelectionMenu, LinkMenu],
		},
	};
};
