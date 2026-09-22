import { createUniqueId } from "solid-js";
import { Menu, MenuBarButton } from "../_Utilities";
import type { ViewMenuProps } from "./ViewMenu-types";
import { createViewMenuItems } from "./ViewMenuItems";

export const ViewMenu = (props: ViewMenuProps) => {
	const popoverId = createUniqueId();

	const items = createViewMenuItems({
		theme: props.theme,
		onThemeChange: props.onThemeChange,
	});

	return (
		<span>
			<MenuBarButton commandfor={popoverId} command="toggle-popover">
				View
			</MenuBarButton>
			<Menu popoverId={popoverId} mainPopoverId={popoverId} items={items} />
		</span>
	);
};
