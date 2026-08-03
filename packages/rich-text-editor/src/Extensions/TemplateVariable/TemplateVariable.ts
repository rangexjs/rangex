import { TemplateVariableAdapter } from "#adapters";
import { configureTemplateVariable } from "#editor-extensions";
import { toolbarButtonsName } from "#ports";
import { TemplateVariableToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const TemplateVariable = createExtension<typeof TemplateVariableAdapter>(
	{
		defaultSettings: {},
		createAdapter: (settings, options) =>
			new TemplateVariableAdapter(settings, options),
		configure: ({ adapter, editorAPI }) =>
			configureTemplateVariable({ editorPort: adapter.editorPort, editorAPI }),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.templateVariable]: TemplateVariableToolbarButton,
			},
		},
	},
);
