import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import { menuBarButtonsName } from "../../../Constants";
import { useMenuBarManagersContext } from "../../App";
import { Menu, MenuBarButton } from "../_Utilities";
import { createViewMenuItems } from "./ViewMenuItems";

export const ViewMenu = () => {
	const { menuBarActionManager, menuBarButtonsStateManager } =
		useMenuBarManagersContext();

	const [theme, setTheme] = createSignal(menuBarButtonsStateManager.theme);

	onMount(() => {
		menuBarButtonsStateManager.subscribe({
			type: menuBarButtonsName.theme,
			callback: setTheme,
		});
	});

	onCleanup(() => {
		menuBarButtonsStateManager.unsubscribe({
			type: menuBarButtonsName.theme,
			callback: setTheme,
		});
	});

	const popoverId = createUniqueId();

	const items = createViewMenuItems({ theme, menuBarActionManager });

	return (
		<span>
			<MenuBarButton commandfor={popoverId} command="toggle-popover">
				View
			</MenuBarButton>
			<Menu popoverId={popoverId} mainPopoverId={popoverId} items={items} />
		</span>
	);
};
