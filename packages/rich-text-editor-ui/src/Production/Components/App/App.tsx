import { useContext } from "solid-js";
import type { ToolbarButtons } from "../../CommonTypes";
import type { MenuBarActionManager } from "../../MenuBarActionManager";
import type { MenuBarButtonsStateManager } from "../../MenuBarButtonsStateManager";
import type {
	CodeBlockPopoverController,
	EmojiPopoverController,
	LinkPopoverController,
	MentionPopoverController,
	TableQuickActionsPopoverController,
} from "../../PopoverControllers";
import type { ToolbarButtonDefaultValues } from "../../ToolbarButtonDefaultValues";
import type {
	CodeBlockLanguage,
	CodeBlockTheme,
	CustomComponentName,
	FontFamilyOption,
} from "../../ToolbarButtonProps";
import type { ToolbarButtonsActionManager } from "../../ToolbarButtonsActionManager";
import type {
	FormatStylesButtonsStateManager,
	HistoryNavigationButtonsStateManager,
	NodeInsertionButtonsStateManager,
	NonCategorizedOperationButtonsStateManager,
} from "../../ToolbarButtonsStateManager";
import { EditorContainer } from "../EditorContainer";
import { EditorToolbar } from "../EditorToolbar";
import { MenuBar } from "../MenuBar";
import {
	CodeBlockPopover,
	EmojiPopover,
	LinkPopover,
	MentionPopover,
	TableQuickActionsPopover,
} from "../NodePopovers";
import {
	EditorOptionsContext,
	MenuBarManagersContext,
	PopoverControllersContext,
	ToolbarButtonManagersContext,
} from "./Context";

export interface EditorOptions {
	codeBlockLanguages: CodeBlockLanguage[];
	codeBlockThemes: CodeBlockTheme[];
	customComponentNames: CustomComponentName[];
	fontFamilyOptions: FontFamilyOption[];
}

export interface MenuBarManagers {
	menuBarActionManager: MenuBarActionManager;
	menuBarButtonsStateManager: MenuBarButtonsStateManager;
}

export interface ToolbarButtonManagers {
	toolbarButtonsActionManager: ToolbarButtonsActionManager;
	formatStylesButtonsStateManager: FormatStylesButtonsStateManager;
	historyNavigationButtonsStateManager: HistoryNavigationButtonsStateManager;
	nodeInsertionButtonsStateManager: NodeInsertionButtonsStateManager;
	nonCategorizedOperationButtonsStateManager: NonCategorizedOperationButtonsStateManager;
	toolbarButtonDefaultValues: ToolbarButtonDefaultValues;
}

export interface PopoverControllers {
	codeBlockPopoverController: CodeBlockPopoverController;
	emojiPopoverController: EmojiPopoverController;
	linkPopoverController: LinkPopoverController;
	mentionPopoverController: MentionPopoverController;
	tableQuickActionsPopoverController: TableQuickActionsPopoverController;
}

export interface AppProps
	extends MenuBarManagers,
		ToolbarButtonManagers,
		PopoverControllers {
	options: EditorOptions;
	toolbarButtons: ToolbarButtons;
	richTextArea: HTMLElement;
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
		formatStylesButtonsStateManager: props.formatStylesButtonsStateManager,
		historyNavigationButtonsStateManager:
			props.historyNavigationButtonsStateManager,
		nodeInsertionButtonsStateManager: props.nodeInsertionButtonsStateManager,
		nonCategorizedOperationButtonsStateManager:
			props.nonCategorizedOperationButtonsStateManager,
		toolbarButtonDefaultValues: props.toolbarButtonDefaultValues,
	};

	const popoverControllersContextValue: PopoverControllers = {
		codeBlockPopoverController: props.codeBlockPopoverController,
		emojiPopoverController: props.emojiPopoverController,
		linkPopoverController: props.linkPopoverController,
		mentionPopoverController: props.mentionPopoverController,
		tableQuickActionsPopoverController:
			props.tableQuickActionsPopoverController,
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
					<EditorToolbar toolbarButtons={props.toolbarButtons} />
				</ToolbarButtonManagersContext.Provider>
				<div>{props.richTextArea}</div>
				<div>
					<PopoverControllersContext.Provider
						value={popoverControllersContextValue}
					>
						<CodeBlockPopover />
						<EmojiPopover />
						<LinkPopover />
						<MentionPopover />
						<TableQuickActionsPopover />
					</PopoverControllersContext.Provider>
				</div>
			</EditorContainer>
		</EditorOptionsContext.Provider>
	);
};
