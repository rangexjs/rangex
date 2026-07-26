import { useContext } from "solid-js";
import type {
	AccordionItemUIPort,
	BlockQuoteUIPort,
	CodeBlockUIPort,
	EmptyMediaUIPort,
	FindReplaceUIPort,
	FormattingUIPort,
	LinkUIPort,
	ListUIPort,
	ReadOnlyUIPort,
	SymbolsUIPort,
	TableUIPort,
	TemplateVariableUIPort,
	TodoListUIPort,
	UndoRedoUIPort,
} from "#adapters";
import type { ToolbarButtons, UIExtension } from "#ports";
import type { MenuBarActionManager } from "../../MenuBarActionManager";
import type { MenuBarButtonsStateManager } from "../../MenuBarButtonsStateManager";
import type { ToolbarButtonsActionManager } from "../../ToolbarButtonsActionManager";
import type { NodeInsertionButtonsStateManager } from "../../ToolbarButtonsStateManager";
import { EditorContainer } from "../EditorContainer";
import { EditorToolbar } from "../EditorToolbar";
import { MenuBar } from "../MenuBar";
import {
	MenuBarManagersContext,
	ToolbarButtonManagersContext,
	UIPortsContext,
} from "./Context";

export interface UIPortsContextValue {
	accordionItemUIPort: AccordionItemUIPort | null;
	linkUIPort: LinkUIPort | null;
	readOnlyUIPort: ReadOnlyUIPort | null;
	undoRedoUIPort: UndoRedoUIPort | null;
	symbolsUIPort: SymbolsUIPort | null;
	findReplaceUIPort: FindReplaceUIPort | null;
	formattingUIPort: FormattingUIPort | null;
	blockQuoteUIPort: BlockQuoteUIPort | null;
	codeBlockUIPort: CodeBlockUIPort | null;
	emptyMediaUIPort: EmptyMediaUIPort | null;
	listUIPort: ListUIPort | null;
	tableUIPort: TableUIPort | null;
	templateVariableUIPort: TemplateVariableUIPort | null;
	todoListUIPort: TodoListUIPort | null;
}

export interface MenuBarManagers {
	menuBarActionManager: MenuBarActionManager;
	menuBarButtonsStateManager: MenuBarButtonsStateManager;
}

export interface ToolbarButtonManagers {
	toolbarButtonsActionManager: ToolbarButtonsActionManager;
	nodeInsertionButtonsStateManager: NodeInsertionButtonsStateManager;
}

export interface AppProps extends MenuBarManagers, ToolbarButtonManagers {
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

export const useToolbarButtonManagersContext = () => {
	const value = useContext(ToolbarButtonManagersContext);

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

	const toolbarButtonManagersContextValue: ToolbarButtonManagers = {
		toolbarButtonsActionManager: props.toolbarButtonsActionManager,
		nodeInsertionButtonsStateManager: props.nodeInsertionButtonsStateManager,
	};

	return (
		<EditorContainer
			menuBarButtonsStateManager={props.menuBarButtonsStateManager}
		>
			<MenuBarManagersContext.Provider value={menuBarManagersContextValue}>
				<MenuBar />
			</MenuBarManagersContext.Provider>
			<ToolbarButtonManagersContext.Provider
				value={toolbarButtonManagersContextValue}
			>
				<UIPortsContext.Provider value={props.uiPorts}>
					<EditorToolbar
						toolbarButtons={props.toolbarButtons}
						extensions={props.extensions}
					/>
				</UIPortsContext.Provider>
			</ToolbarButtonManagersContext.Provider>
			<div class="relative max-h-300 overflow-y-auto">
				<div>{props.richTextArea}</div>
				<div ref={props.overlayContainerRef} />
			</div>
		</EditorContainer>
	);
};
