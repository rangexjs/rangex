import { Image as ImageFactory } from "@rangex/editor/image";

import { ImageQuickActions } from "#features";

import type { Extension } from "../_Utilities";
import type { ImageExtensionSettings } from "./Image-types";

export const Image = (settings: ImageExtensionSettings): Extension => {
	return {
		createAdapter: () => ImageFactory(settings),
		components: {
			toolbarButtons: {},
			floatingComponents: [ImageQuickActions],
		},
	};
};
