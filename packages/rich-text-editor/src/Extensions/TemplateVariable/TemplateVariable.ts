import { TemplateVariable as TemplateVariableFactory } from "@rangex/editor";
import { toolbarButtonsName } from "#constants";
import {
	TemplateVariableCaretMenu,
	TemplateVariableToolbarButton,
} from "#features";
import type { Extension } from "../_Utilities";
import type { TemplateVariableExtensionSettings } from "./TemplateVariable-types";

export const TemplateVariable = <FieldName extends string>(
	settings: TemplateVariableExtensionSettings<FieldName>,
): Extension => {
	const { fieldsConfig, dropdown } = settings;

	return {
		createAdapter: () => TemplateVariableFactory({ fieldsConfig }),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.templateVariable]: TemplateVariableToolbarButton,
			},
			floatingComponents: [TemplateVariableCaretMenu],
		},
		uiOptions: {
			templateVariable: { dropdown },
		},
	};
};
