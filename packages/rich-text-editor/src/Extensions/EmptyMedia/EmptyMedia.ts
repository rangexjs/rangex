import { EmptyMedia as EmptyMediaFactory } from "@rangex/editor/empty-media";
import { toolbarButtonsName } from "#constants";
import { EmptyMediaToolbarButton, registerEmptyMedia } from "#features";
import type { Extension } from "../_Utilities";
import type { EmptyMediaExtensionSettings } from "./EmptyMedia-types";

export const EmptyMedia = (
	settings: EmptyMediaExtensionSettings,
): Extension => {
	return {
		createAdapter: () => EmptyMediaFactory(settings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.media]: EmptyMediaToolbarButton,
			},
			floatingComponents: [],
		},
		register: registerEmptyMedia,
	};
};
