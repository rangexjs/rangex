import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import { menuBarButtonsName } from "../../../Constants";
import { useMenuBarManagersContext } from "../../App";
import { Menu, MenuBarButton } from "../_Utilities";
import { createSettingsMenuItems } from "./SettingsMenuItems";

export const SettingsMenu = () => {
	const { menuBarActionManager, menuBarButtonsStateManager } =
		useMenuBarManagersContext();

	const [vimMode, setVimMode] = createSignal(
		menuBarButtonsStateManager.vimMode,
	);
	const [language, setLanguage] = createSignal(
		menuBarButtonsStateManager.language,
	);

	onMount(() => {
		menuBarButtonsStateManager.subscribe({
			type: menuBarButtonsName.vimMode,
			callback: setVimMode,
		});

		menuBarButtonsStateManager.subscribe({
			type: menuBarButtonsName.language,
			callback: setLanguage,
		});
	});

	onCleanup(() => {
		menuBarButtonsStateManager.unsubscribe({
			type: menuBarButtonsName.vimMode,
			callback: setVimMode,
		});

		menuBarButtonsStateManager.unsubscribe({
			type: menuBarButtonsName.language,
			callback: setLanguage,
		});
	});

	const popoverId = createUniqueId();

	const items = createSettingsMenuItems({
		vimMode,
		language,
		menuBarActionManager,
	});

	return (
		<span>
			<MenuBarButton commandfor={popoverId} command="toggle-popover">
				Settings
			</MenuBarButton>
			<Menu popoverId={popoverId} mainPopoverId={popoverId} items={items} />
		</span>
	);
};
