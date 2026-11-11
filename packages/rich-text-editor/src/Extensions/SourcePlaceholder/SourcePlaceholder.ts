import { SourcePlaceholder as SourcePlaceholderFactory } from "@rangex/editor/source-placeholder";

import { toolbarButtonsName } from "#constants";
import { registerSourcePlaceholder, SourcePlaceholderToolbarButton } from "#features";

import type { Extension } from "../_Utilities";
import type { SourcePlaceholderExtensionSettings } from "./SourcePlaceholder-types";

export const SourcePlaceholder = (settings: SourcePlaceholderExtensionSettings): Extension => {
	return {
		createAdapter: () => SourcePlaceholderFactory(settings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.media]: SourcePlaceholderToolbarButton,
			},
			floatingComponents: [],
		},
		register: (editor) => {
			registerSourcePlaceholder({ editor, settings });
		},
	};
};
