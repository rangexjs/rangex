import { Audio as AudioFactory } from "@rangex/editor/audio";
import { AudioQuickActions } from "#features";
import type { Extension } from "../_Utilities";
import type { AudioExtensionSettings } from "./Audio-types";

export const Audio = (settings: AudioExtensionSettings): Extension => {
	return {
		createAdapter: () => AudioFactory(settings),
		components: {
			toolbarButtons: {},
			floatingComponents: [AudioQuickActions],
		},
	};
};
