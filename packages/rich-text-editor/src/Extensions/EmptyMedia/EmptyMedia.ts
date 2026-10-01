import { EmptyMedia as EmptyMediaFactory } from "@rangex/editor/empty-media";
import { toolbarButtonsName } from "#constants";
import { EmptyMediaToolbarButton, registerEmptyMedia } from "#features";
import type { Extension } from "../_Utilities";

export const EmptyMedia = (
	...adapterSettings: Parameters<typeof EmptyMediaFactory>
): Extension => {
	return {
		createAdapter: () => EmptyMediaFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.media]: EmptyMediaToolbarButton,
			},
			floatingComponents: [],
		},
		register: registerEmptyMedia,
	};
};
