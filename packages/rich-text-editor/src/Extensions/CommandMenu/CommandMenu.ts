import { CommandMenu as CommandMenuFactory } from "@rangex/editor/command-menu";
import { CommandMenuCaretMenu } from "#features";
import type { Extension } from "../_Utilities";

export const CommandMenu = (
	...adapterSettings: Parameters<typeof CommandMenuFactory>
): Extension => {
	return {
		createAdapter: () => CommandMenuFactory(...adapterSettings),
		components: {
			toolbarButtons: {},
			floatingComponents: [CommandMenuCaretMenu],
		},
	};
};
