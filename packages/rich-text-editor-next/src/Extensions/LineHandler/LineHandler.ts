import { LineHandler as LineHandlerFactory } from "@rangex/editor";
import { LineHandlerOverlay } from "#features";
import type { Extension } from "../_Utilities";

export const LineHandler = (
	...adapterSettings: Parameters<typeof LineHandlerFactory>
): Extension => {
	return {
		createAdapter: () => LineHandlerFactory(...adapterSettings),
		components: {
			toolbarButtons: {},
			floatingComponents: [LineHandlerOverlay],
		},
	};
};
