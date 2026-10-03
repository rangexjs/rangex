import { LineHandler as LineHandlerFactory } from "@rangex/editor/line-handler";
import { LineHandlerOverlay } from "#features";
import type { Extension } from "../_Utilities";
import type { LineHandlerExtensionSettings } from "./LineHandler-types";

export const LineHandler = (
	settings: LineHandlerExtensionSettings,
): Extension => {
	return {
		createAdapter: () => LineHandlerFactory(settings),
		components: {
			toolbarButtons: {},
			floatingComponents: [LineHandlerOverlay],
		},
	};
};
