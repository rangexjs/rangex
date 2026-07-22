import { useContext } from "solid-js";
import type {
	CodeBlockLanguage,
	CodeBlockTheme,
	ToolbarButtons,
	UIExtension,
} from "#ports";
import type { MenuBarActionManager } from "../../MenuBarActionManager";
import type { MenuBarButtonsStateManager } from "../../MenuBarButtonsStateManager";
import type {
	AudioPopoverController,
	BlockResizePopoverController,
	CodeBlockPopoverController,
	EmbedPopoverController,
	EmojiPopoverController,
	ImagePopoverController,
	TableQuickActionsPopoverController,
	TemplateVariablePopoverController,
	VideoPopoverController,
} from "../../PopoverControllers";
import type {
	CustomComponentName,
	FontFamilyOption,
} from "../../ToolbarButtonProps";
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
	AudioPopover,
	BlockResizePopover,
	CodeBlockPopover,
	EmbedPopover,
	EmojiPopover,
	ImagePopover,
	TableQuickActionsPopover,
	TemplateVariablePopover,
	VideoPopover,
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
	historyNavigationButtonsStateManager: HistoryNavigationButtonsStateManager;
	nodeInsertionButtonsStateManager: NodeInsertionButtonsStateManager;
	nonCategorizedOperationButtonsStateManager: NonCategorizedOperationButtonsStateManager;
}

export interface PopoverControllers {
	audioPopoverController: AudioPopoverController;
	blockResizePopoverController: BlockResizePopoverController;
	codeBlockPopoverController: CodeBlockPopoverController;
	embedPopoverController: EmbedPopoverController;
	emojiPopoverController: EmojiPopoverController;
	imagePopoverController: ImagePopoverController;
	tableQuickActionsPopoverController: TableQuickActionsPopoverController;
	templateVariablePopoverController: TemplateVariablePopoverController;
	videoPopoverController: VideoPopoverController;
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
		audioPopoverController: props.audioPopoverController,
		blockResizePopoverController: props.blockResizePopoverController,
		codeBlockPopoverController: props.codeBlockPopoverController,
		embedPopoverController: props.embedPopoverController,
		emojiPopoverController: props.emojiPopoverController,
		imagePopoverController: props.imagePopoverController,
		tableQuickActionsPopoverController:
			props.tableQuickActionsPopoverController,
		templateVariablePopoverController: props.templateVariablePopoverController,
		videoPopoverController: props.videoPopoverController,
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
							<AudioPopover />
							<BlockResizePopover />
							<CodeBlockPopover />
							<EmbedPopover />
							<EmojiPopover />
							<ImagePopover />
							<TableQuickActionsPopover />
							<TemplateVariablePopover />
							<VideoPopover />
						</PopoverControllersContext.Provider>
					</div>
				</div>
			</EditorContainer>
		</EditorOptionsContext.Provider>
	);
};
