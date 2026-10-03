import { CommandMenu as CommandMenuFactory } from "@rangex/editor/command-menu";
import { CommandMenuCaretMenu } from "#features";
import type { Extension } from "../_Utilities";
import type { CommandMenuExtensionSettings } from "./CommandMenu-types";

export const CommandMenu = (
	settings: CommandMenuExtensionSettings,
): Extension => {
	return {
		createAdapter: () => CommandMenuFactory(settings),
		components: {
			toolbarButtons: {},
			floatingComponents: [CommandMenuCaretMenu],
		},
	};
};
