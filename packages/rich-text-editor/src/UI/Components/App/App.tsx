import { useContext } from "solid-js";
import type { ToolbarButtons, UIExtension } from "#ports";
import type { MenuBarActionManager } from "../../MenuBarActionManager";
import type { MenuBarButtonsStateManager } from "../../MenuBarButtonsStateManager";
import type {
	EmojiPopoverController,
	TableQuickActionsPopoverController,
	TemplateVariablePopoverController,
} from "../../PopoverControllers";
import type { CustomComponentName } from "../../ToolbarButtonProps";
import type { ToolbarButtonsActionManager } from "../../ToolbarButtonsActionManager";
import type {
	HistoryNavigationButtonsStateManager,
	NodeInsertionButtonsStateManager,
	NonCategorizedOperationButtonsStateManager,
} from "../../ToolbarButtonsStateManager";
import { EditorContainer } from "../EditorContainer";
import { EditorToolbar } from "../EditorToolbar";
import { MenuBar } from "../MenuBar";
import {
	EmojiPopover,
	TableQuickActionsPopover,
	TemplateVariablePopover,
} from "../NodePopovers";
import {
	EditorOptionsContext,
	MenuBarManagersContext,
	PopoverControllersContext,
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
	historyNavigationButtonsStateManager: HistoryNavigationButtonsStateManager;
	nodeInsertionButtonsStateManager: NodeInsertionButtonsStateManager;
	nonCategorizedOperationButtonsStateManager: NonCategorizedOperationButtonsStateManager;
}

export interface PopoverControllers {
	emojiPopoverController: EmojiPopoverController;
	tableQuickActionsPopoverController: TableQuickActionsPopoverController;
	templateVariablePopoverController: TemplateVariablePopoverController;
}

export interface AppProps
	extends MenuBarManagers,
		ToolbarButtonManagers,
		PopoverControllers {
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

export const usePopoverControllersContext = () => {
	const value = useContext(PopoverControllersContext);

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
		historyNavigationButtonsStateManager:
			props.historyNavigationButtonsStateManager,
		nodeInsertionButtonsStateManager: props.nodeInsertionButtonsStateManager,
		nonCategorizedOperationButtonsStateManager:
			props.nonCategorizedOperationButtonsStateManager,
	};

	const popoverControllersContextValue: PopoverControllers = {
		emojiPopoverController: props.emojiPopoverController,
		tableQuickActionsPopoverController:
			props.tableQuickActionsPopoverController,
		templateVariablePopoverController: props.templateVariablePopoverController,
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
					<div>
						<PopoverControllersContext.Provider
							value={popoverControllersContextValue}
						>
							<EmojiPopover />
							<TableQuickActionsPopover />
							<TemplateVariablePopover />
						</PopoverControllersContext.Provider>
					</div>
				</div>
			</EditorContainer>
		</EditorOptionsContext.Provider>
	);
};
