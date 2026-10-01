import { Video as VideoFactory } from "@rangex/editor/video";
import { VideoQuickActions } from "#features";
import type { Extension } from "../_Utilities";

export const Video = (
	...adapterSettings: Parameters<typeof VideoFactory>
): Extension => {
	return {
		createAdapter: () => VideoFactory(...adapterSettings),
		components: {
			toolbarButtons: {},
			floatingComponents: [VideoQuickActions],
		},
	};
};
