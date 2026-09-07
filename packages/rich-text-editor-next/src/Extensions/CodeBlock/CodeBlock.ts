import { CodeBlock as CodeBlockFactory } from "@rangex/editor";
import { toolbarButtonsName } from "#constants";
import { CodeBlockToolbarButton } from "#features";
import type { Extension } from "../_Utilities";

export const CodeBlock = (
	...adapterSettings: Parameters<typeof CodeBlockFactory>
): Extension => {
	return {
		createAdapter: () => CodeBlockFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.codeBlock]: CodeBlockToolbarButton,
			},
		},
	};
};
