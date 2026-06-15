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
			<MenuBarButton
				onClick={() =>
					menuBarActionManager.emitMenuBarChange({ type: "preview-as" })
				}
				commandfor={dialogId}
				command="show-modal"
			>
				Preview
			</MenuBarButton>
			<PreviewDialog
				dialogId={dialogId}
				menuBarButtonsStateManager={menuBarButtonsStateManager}
			/>
		</span>
	);
};
