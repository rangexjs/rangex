import { MarkdownAdapter } from "#adapters";
import { configureMarkdown } from "#editor-extensions";
import { createExtension } from "../_Utilities";

export const Markdown = createExtension<typeof MarkdownAdapter>({
	createAdapter: (settings, options) => new MarkdownAdapter(settings, options),
	configure: ({ editorAPI }) => configureMarkdown({ editorAPI }),
	components: {},
});
