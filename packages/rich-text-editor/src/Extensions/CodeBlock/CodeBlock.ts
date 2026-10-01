import { CodeBlock as CodeBlockFactory } from "@rangex/editor/code-block";
import { toolbarButtonsName } from "#constants";
import type { CodeBlockUIOptions } from "#context";
import { CodeBlockQuickActions, CodeBlockToolbarButton } from "#features";
import type { Extension } from "../_Utilities";

export const CodeBlock = (
	settings: Parameters<typeof CodeBlockFactory>[0] & CodeBlockUIOptions,
): Extension => {
	const {
		languages,
		themes,
		defaultLanguage,
		defaultTheme,
		...adapterSettings
	} = settings;

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
