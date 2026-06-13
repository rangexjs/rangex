import type { Accessor } from "solid-js";
import { menuBarButtonsName } from "../../../Constants";
import type { MenuBarActionManager } from "../../../MenuBarActionManager";
import type { TemplateMenuBarButtonState } from "../../../MenuBarButtonProps";
import type { MenuItem } from "../_Utilities";

export interface CreateTemplateMenuItemsParams {
	template: Accessor<TemplateMenuBarButtonState>;
	menuBarActionManager: MenuBarActionManager;
}

export function createTemplateMenuItems({
	template,
	menuBarActionManager,
}: CreateTemplateMenuItemsParams): MenuItem[] {
	return [
		{
			type: "button",
			label: "Default",
			checked: () => template().value === "default",
			onClick: () =>
				menuBarActionManager.emitMenuBarChange({
					type: menuBarButtonsName.template,
					newValue: "default",
				}),
		},
		{
			type: "button",
			label: "Document",
			checked: () => template().value === "document",
			onClick: () =>
				menuBarActionManager.emitMenuBarChange({
					type: menuBarButtonsName.template,
					newValue: "document",
				}),
		},
		{
			type: "button",
			label: "Paginated",
			checked: () => template().value === "paginated",
			onClick: () =>
				menuBarActionManager.emitMenuBarChange({
					type: menuBarButtonsName.template,
					newValue: "paginated",
				}),
		},
	];
}
