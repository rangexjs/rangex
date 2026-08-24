import { useContext } from "solid-js";
import type { AdapterUIPorts } from "#adapters";
import type { ToolbarButtons, UIExtension } from "#ports";
import type { MenuBarActionManager } from "../../MenuBarActionManager";
import type { MenuBarButtonsStateManager } from "../../MenuBarButtonsStateManager";
import { CommandMenu } from "../CommandMenu";
import { EditorContainer } from "../EditorContainer";
import { EditorToolbar } from "../EditorToolbar";
import { MenuBar } from "../MenuBar";
import { MenuBarManagersContext, UIPortsContext } from "./Context";

export type UIPortsContextValue = {
	[K in keyof AdapterUIPorts]: AdapterUIPorts[K] | null;
};

export interface MenuBarManagers {
	menuBarActionManager: MenuBarActionManager;
	menuBarButtonsStateManager: MenuBarButtonsStateManager;
}

export interface AppProps extends MenuBarManagers {
	toolbarButtons: ToolbarButtons;
	extensions: UIExtension[];
	uiPorts: UIPortsContextValue;
	richTextArea: HTMLElement;
	overlayContainerRef: (element: HTMLDivElement) => void;
}

export const useMenuBarManagersContext = () => {
	const value = useContext(MenuBarManagersContext);

	if (!value) {
		throw new Error("Value can't be undefined.");
	}

	return value;
};

export const useUIPortsContext = () => {
	const value = useContext(UIPortsContext);

	if (!value) {
		throw new Error("Value can't be undefined.");
	}

	return value;
};

export const App = (props: AppProps) => {
	const menuBarManagersContextValue: MenuBarManagers = {
		menuBarActionManager: props.menuBarActionManager,
		menuBarButtonsStateManager: props.menuBarButtonsStateManager,
	};

	return (
		<EditorContainer
			menuBarButtonsStateManager={props.menuBarButtonsStateManager}
		>
			<MenuBarManagersContext.Provider value={menuBarManagersContextValue}>
				<MenuBar />
			</MenuBarManagersContext.Provider>
			<UIPortsContext.Provider value={props.uiPorts}>
				<EditorToolbar
					toolbarButtons={props.toolbarButtons}
					extensions={props.extensions}
				/>
				<div class="relative max-h-210 overflow-y-auto">
					<div>{props.richTextArea}</div>
					<div ref={props.overlayContainerRef} />
					<div>
						<CommandMenu />
					</div>
				</div>
			</UIPortsContext.Provider>
		</EditorContainer>
	);
};
