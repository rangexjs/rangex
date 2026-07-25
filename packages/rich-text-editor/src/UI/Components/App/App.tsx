import { useContext } from "solid-js";
import type { ToolbarButtons, UIExtension } from "#ports";
import type { MenuBarActionManager } from "../../MenuBarActionManager";
import type { MenuBarButtonsStateManager } from "../../MenuBarButtonsStateManager";
import type { CustomComponentName } from "../../ToolbarButtonProps";
import type { ToolbarButtonsActionManager } from "../../ToolbarButtonsActionManager";
import type {
	NodeInsertionButtonsStateManager,
	NonCategorizedOperationButtonsStateManager,
} from "../../ToolbarButtonsStateManager";
import { EditorContainer } from "../EditorContainer";
import { EditorToolbar } from "../EditorToolbar";
import { MenuBar } from "../MenuBar";
import {
	EditorOptionsContext,
	MenuBarManagersContext,
	ToolbarButtonManagersContext,
} from "./Context";

export interface EditorOptions {
	customComponentNames: CustomComponentName[];
}

export interface MenuBarManagers {
	menuBarActionManager: MenuBarActionManager;
	menuBarButtonsStateManager: MenuBarButtonsStateManager;
}

export interface ToolbarButtonManagers {
	toolbarButtonsActionManager: ToolbarButtonsActionManager;
	nodeInsertionButtonsStateManager: NodeInsertionButtonsStateManager;
	nonCategorizedOperationButtonsStateManager: NonCategorizedOperationButtonsStateManager;
}

export interface AppProps extends MenuBarManagers, ToolbarButtonManagers {
	options: EditorOptions;
	toolbarButtons: ToolbarButtons;
	extensions: UIExtension[];
	richTextArea: HTMLElement;
	overlayContainerRef: (element: HTMLDivElement) => void;
}

export const useEditorOptionsContext = () => {
	const value = useContext(EditorOptionsContext);

	if (!value) {
		throw new Error("Value can't be undefined.");
	}

	return value;
};

export const useMenuBarManagersContext = () => {
	const value = useContext(MenuBarManagersContext);

	if (!value) {
		throw new Error("Value can't be undefined.");
	}

	return value;
};

export const useToolbarButtonManagersContext = () => {
	const value = useContext(ToolbarButtonManagersContext);

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

	const toolbarButtonManagersContextValue: ToolbarButtonManagers = {
		toolbarButtonsActionManager: props.toolbarButtonsActionManager,
		nodeInsertionButtonsStateManager: props.nodeInsertionButtonsStateManager,
		nonCategorizedOperationButtonsStateManager:
			props.nonCategorizedOperationButtonsStateManager,
	};

	const editorOptionsContextValue: EditorOptions = props.options;

	return (
		<EditorOptionsContext.Provider value={editorOptionsContextValue}>
			<EditorContainer
				menuBarButtonsStateManager={props.menuBarButtonsStateManager}
			>
				<MenuBarManagersContext.Provider value={menuBarManagersContextValue}>
					<MenuBar />
				</MenuBarManagersContext.Provider>
				<ToolbarButtonManagersContext.Provider
					value={toolbarButtonManagersContextValue}
				>
					<EditorToolbar
						toolbarButtons={props.toolbarButtons}
						extensions={props.extensions}
					/>
				</ToolbarButtonManagersContext.Provider>
				<div class="relative max-h-300 overflow-y-auto">
					<div>{props.richTextArea}</div>
					<div ref={props.overlayContainerRef} />
				</div>
			</EditorContainer>
		</EditorOptionsContext.Provider>
	);
};
