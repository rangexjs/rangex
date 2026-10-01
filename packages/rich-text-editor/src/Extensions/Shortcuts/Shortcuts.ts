import { Shortcuts as ShortcutsFactory } from "@rangex/editor/shortcuts";
import type { Extension } from "../_Utilities";

export const Shortcuts = (
	...adapterSettings: Parameters<typeof ShortcutsFactory>
): Extension => {
	return {
		createAdapter: () => ShortcutsFactory(...adapterSettings),
		components: {
			toolbarButtons: {},
			floatingComponents: [],
		},
	};
};
