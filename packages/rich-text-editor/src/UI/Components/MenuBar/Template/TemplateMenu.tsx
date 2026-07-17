import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import { menuBarButtonsName } from "../../../Constants";
import { useMenuBarManagersContext } from "../../App";
import { Menu, MenuBarButton } from "../_Utilities";
import { createTemplateMenuItems } from "./TemplateMenuItems";

export const TemplateMenu = () => {
	const { menuBarActionManager, menuBarButtonsStateManager } =
		useMenuBarManagersContext();

	const [template, setTemplate] = createSignal(
		menuBarButtonsStateManager.template,
	);

	onMount(() => {
		menuBarButtonsStateManager.subscribe({
			type: menuBarButtonsName.template,
			callback: setTemplate,
		});
	});

	onCleanup(() => {
		menuBarButtonsStateManager.unsubscribe({
			type: menuBarButtonsName.template,
			callback: setTemplate,
		});
	});

	const popoverId = createUniqueId();

	const items = createTemplateMenuItems({ template, menuBarActionManager });

	return (
		<span>
			<MenuBarButton commandfor={popoverId} command="toggle-popover">
				Template
			</MenuBarButton>
			<Menu popoverId={popoverId} mainPopoverId={popoverId} items={items} />
		</span>
	);
};
