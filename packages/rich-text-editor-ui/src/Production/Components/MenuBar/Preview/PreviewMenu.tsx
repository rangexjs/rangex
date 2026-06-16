import { createUniqueId } from "solid-js";
import { useMenuBarManagersContext } from "../../App";
import { MenuBarButton } from "../_Utilities";
import { PreviewDialog } from "./PreviewDialog";

export const PreviewMenu = () => {
	const { menuBarActionManager, menuBarButtonsStateManager } =
		useMenuBarManagersContext();
	const dialogId = createUniqueId();

	return (
		<span>
			<MenuBarButton commandfor={dialogId} command="show-modal">
				Preview
			</MenuBarButton>
			<PreviewDialog
				dialogId={dialogId}
				menuBarActionManager={menuBarActionManager}
				menuBarButtonsStateManager={menuBarButtonsStateManager}
			/>
		</span>
	);
};
