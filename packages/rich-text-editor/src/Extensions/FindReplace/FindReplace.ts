import { FindReplace as FindReplaceFactory } from "@rangex/editor/find-replace";
import { toolbarButtonsName } from "#constants";
import { FindReplaceToolbarButton } from "#features";
import type { Extension } from "../_Utilities";
import type { FindReplaceExtensionSettings } from "./FindReplace-types";

export const FindReplace = (
	settings: FindReplaceExtensionSettings,
): Extension => {
	return {
		createAdapter: () => FindReplaceFactory(settings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.findReplace]: FindReplaceToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
