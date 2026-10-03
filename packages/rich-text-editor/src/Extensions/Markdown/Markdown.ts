import { Markdown as MarkdownFactory } from "@rangex/editor/markdown";
import type { Extension } from "../_Utilities";
import type { MarkdownExtensionSettings } from "./Markdown-types";

export const Markdown = (settings: MarkdownExtensionSettings): Extension => {
	return {
		createAdapter: () => MarkdownFactory(settings),
		components: {
			toolbarButtons: {},
			floatingComponents: [],
		},
	};
};
