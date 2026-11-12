import { CodeBlock as CodeBlockFactory } from "@rangex/editor/code-block";

import { toolbarButtonsName } from "#constants";
import { CodeBlockQuickActions, CodeBlockToolbarButton } from "#features";

import type { Extension } from "../_Utilities";
import type { CodeBlockExtensionSettings } from "./CodeBlock-types";

export const CodeBlock = (settings: CodeBlockExtensionSettings): Extension => {
	const { languages, themes, defaultLanguage, defaultTheme, ...adapterSettings } = settings;

	return {
		createAdapter: () => CodeBlockFactory(adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.codeBlock]: CodeBlockToolbarButton,
			},
			floatingComponents: [CodeBlockQuickActions],
		},
		uiOptions: {
			codeBlock: { languages, themes, defaultLanguage, defaultTheme },
		},
	};
};
