import { EmptyMediaAdapter } from "#adapters";
import { configureEmptyMedia } from "#editor-extensions";
import { toolbarButtonsName } from "#ports";
import { EmptyMediaToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const EmptyMedia = createExtension<typeof EmptyMediaAdapter>({
	createAdapter: (settings, options) =>
		new EmptyMediaAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureEmptyMedia({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.media]: EmptyMediaToolbarButton,
		},
	},
});
