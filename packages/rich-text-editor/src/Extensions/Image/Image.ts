import { Image as ImageFactory } from "@rangex/editor/image";
import { ImageQuickActions } from "#features";
import type { Extension } from "../_Utilities";

export const Image = (
	...adapterSettings: Parameters<typeof ImageFactory>
): Extension => {
	return {
		createAdapter: () => ImageFactory(...adapterSettings),
		components: {
			toolbarButtons: {},
			floatingComponents: [ImageQuickActions],
		},
	};
};
