import { CodeBlockAdapter } from "#adapters";
import { configureCodeBlock } from "#editor-extensions";
import { toolbarButtonsName } from "#ports";
import { CodeBlockToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const CodeBlock = createExtension<typeof CodeBlockAdapter>({
	createAdapter: (settings, options) => new CodeBlockAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureCodeBlock({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.codeBlock]: CodeBlockToolbarButton,
		},
	},
});
