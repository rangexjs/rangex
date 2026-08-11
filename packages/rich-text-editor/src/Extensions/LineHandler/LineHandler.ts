import { LineHandlerAdapter } from "#adapters";
import { configureLineHandler } from "#editor-extensions";
import { createExtension } from "../_Utilities";

export const LineHandler = createExtension<typeof LineHandlerAdapter>({
	createAdapter: (settings, options) =>
		new LineHandlerAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureLineHandler({ editorPort: adapter.editorPort, editorAPI }),
	components: {},
});
