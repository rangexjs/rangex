import { ReadOnly as ReadOnlyFactory } from "@rangex/editor/read-only";

import { toolbarButtonsName } from "#constants";
import { ReadOnlyToolbarButton } from "#features";

import type { Extension } from "../_Utilities";
import type { ReadOnlyExtensionSettings } from "./ReadOnly-types";

export const ReadOnly = (settings: ReadOnlyExtensionSettings): Extension => {
	return {
		createAdapter: () => ReadOnlyFactory(settings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.readOnly]: ReadOnlyToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
