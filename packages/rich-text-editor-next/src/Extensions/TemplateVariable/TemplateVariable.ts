import { TemplateVariable as TemplateVariableFactory } from "@rangex/editor";
import { toolbarButtonsName } from "#constants";
import {
	TemplateVariableCaretMenu,
	TemplateVariableToolbarButton,
} from "#features";
import type { Extension } from "../_Utilities";

export const TemplateVariable = (
	...adapterSettings: Parameters<typeof TemplateVariableFactory>
): Extension => {
	return {
		createAdapter: () => TemplateVariableFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.templateVariable]: TemplateVariableToolbarButton,
			},
			floatingComponents: [TemplateVariableCaretMenu],
		},
	};
};
