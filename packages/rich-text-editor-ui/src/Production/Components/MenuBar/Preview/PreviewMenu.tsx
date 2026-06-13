import { createSignal } from "solid-js";
import { useMenuBarManagersContext } from "../../App";
import { MenuBarButton } from "../_Utilities";
import { PreviewDialog } from "./PreviewDialog";

export const PreviewMenu = () => {
	const { menuBarActionManager } = useMenuBarManagersContext();
	const [isOpen, setIsOpen] = createSignal(false);

	const onOpen = () => {
		menuBarActionManager.emitMenuBarChange({ type: "preview-as" });
		setIsOpen(true);
	};

	return (
		<span>
			<MenuBarButton onClick={onOpen}>Preview</MenuBarButton>
			<PreviewDialog open={isOpen} onClose={() => setIsOpen(false)} />
		</span>
	);
};
