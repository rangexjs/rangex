import type { Accessor } from "solid-js";
import { menuBarButtonsName } from "../../../Constants";
import type { MenuBarActionManager } from "../../../MenuBarActionManager";
import type { ThemeMenuBarButtonState } from "../../../MenuBarButtonProps";
import type { MenuItem } from "../_Utilities";

export interface CreateViewMenuItemsParams {
	theme: Accessor<ThemeMenuBarButtonState>;
	menuBarActionManager: MenuBarActionManager;
}

export function createViewMenuItems({
	theme,
	menuBarActionManager,
}: CreateViewMenuItemsParams): MenuItem[] {
	return [
		{
			type: "submenu",
			label: "Theme",
			items: [
				{
					type: "button",
					label: "Light",
					checked: () => theme().value === "light",
					onClick: () =>
						menuBarActionManager.emitMenuBarChange({
							type: menuBarButtonsName.theme,
							newValue: "light",
						}),
				},
				{
					type: "button",
					label: "Dark",
					checked: () => theme().value === "dark",
					onClick: () =>
						menuBarActionManager.emitMenuBarChange({
							type: menuBarButtonsName.theme,
							newValue: "dark",
						}),
				},
				{
					type: "button",
					label: "System",
					checked: () => theme().value === "system",
					onClick: () =>
						menuBarActionManager.emitMenuBarChange({
							type: menuBarButtonsName.theme,
							newValue: "system",
						}),
				},
				{
					type: "button",
					label: "Host page",
					checked: () => theme().value === "inherit",
					onClick: () =>
						menuBarActionManager.emitMenuBarChange({
							type: menuBarButtonsName.theme,
							newValue: "inherit",
						}),
				},
			],
		},
	];
}
