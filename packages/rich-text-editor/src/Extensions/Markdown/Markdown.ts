import { Markdown as MarkdownFactory } from "@rangex/editor/markdown";
import type { Extension } from "../_Utilities";

export const Markdown = (
	...adapterSettings: Parameters<typeof MarkdownFactory>
): Extension => {
	return {
		createAdapter: () => MarkdownFactory(...adapterSettings),
		components: {
			toolbarButtons: {},
			floatingComponents: [],
		},
	};
};
