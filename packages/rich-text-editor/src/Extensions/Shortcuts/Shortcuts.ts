import { Shortcuts as ShortcutsFactory } from "@rangex/editor/shortcuts";
import type { Extension } from "../_Utilities";
import type { ShortcutsExtensionSettings } from "./Shortcuts-types";

export const Shortcuts = (settings: ShortcutsExtensionSettings): Extension => {
	return {
		createAdapter: () => ShortcutsFactory(settings),
		components: {
			toolbarButtons: {},
			floatingComponents: [],
		},
	};
};
