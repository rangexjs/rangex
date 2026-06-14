import type { Accessor } from "solid-js";
import { menuBarButtonsName } from "../../../Constants";
import type { MenuBarActionManager } from "../../../MenuBarActionManager";
import type {
	LanguageMenuBarButtonState,
	VimModeMenuBarButtonState,
} from "../../../MenuBarButtonProps";
import type { MenuItem } from "../_Utilities";

export interface CreateSettingsMenuItemsParams {
	vimMode: Accessor<VimModeMenuBarButtonState>;
	language: Accessor<LanguageMenuBarButtonState>;
	menuBarActionManager: MenuBarActionManager;
}

export function createSettingsMenuItems({
	vimMode,
	language,
	menuBarActionManager,
}: CreateSettingsMenuItemsParams): MenuItem[] {
	return [
		{
			type: "button",
			label: "Vim mode",
			checked: () => vimMode().enabled,
			onClick: () =>
				menuBarActionManager.emitMenuBarChange({
					type: menuBarButtonsName.vimMode,
					newValue: !vimMode().enabled,
				}),
		},
		{
			type: "submenu",
			label: "Language",
			items: [
				{
					type: "button",
					label: "English",
					checked: () => language().value === "en",
					onClick: () =>
						menuBarActionManager.emitMenuBarChange({
							type: menuBarButtonsName.language,
							newValue: "en",
						}),
				},
				{
					type: "button",
					label: "Spanish",
					checked: () => language().value === "es",
					onClick: () =>
						menuBarActionManager.emitMenuBarChange({
							type: menuBarButtonsName.language,
							newValue: "es",
						}),
				},
				{
					type: "button",
					label: "French",
					checked: () => language().value === "fr",
					onClick: () =>
						menuBarActionManager.emitMenuBarChange({
							type: menuBarButtonsName.language,
							newValue: "fr",
						}),
				},
				{
					type: "button",
					label: "German",
					checked: () => language().value === "de",
					onClick: () =>
						menuBarActionManager.emitMenuBarChange({
							type: menuBarButtonsName.language,
							newValue: "de",
						}),
				},
			],
		},
	];
}
