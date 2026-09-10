import { Link as LinkFactory } from "@rangex/editor";
import { toolbarButtonsName } from "#constants";
import { LinkCard, LinkToolbarButton } from "#features";
import type { Extension } from "../_Utilities";

export const Link = (
	...adapterSettings: Parameters<typeof LinkFactory>
): Extension => {
	return {
		createAdapter: () => LinkFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.link]: LinkToolbarButton,
			},
			floatingComponents: [LinkCard],
		},
	};
};
