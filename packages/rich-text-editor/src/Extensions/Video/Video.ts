import { Video as VideoFactory } from "@rangex/editor/video";
import { VideoQuickActions } from "#features";
import type { Extension } from "../_Utilities";
import type { VideoExtensionSettings } from "./Video-types";

export const Video = (settings: VideoExtensionSettings): Extension => {
	return {
		createAdapter: () => VideoFactory(settings),
		components: {
			toolbarButtons: {},
			floatingComponents: [VideoQuickActions],
		},
	};
};
