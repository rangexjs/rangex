import { useContext } from "solid-js";
import type { ToolbarButtons } from "../../CommonTypes";
import type { MenuBarActionManager } from "../../MenuBarActionManager";
import type { MenuBarButtonsStateManager } from "../../MenuBarButtonsStateManager";
import type {
	AudioEditPopoverController,
	AudioSwapPopoverController,
	BlockResizePopoverController,
	CodeBlockPopoverController,
	EmbedEditPopoverController,
	EmbedSwapPopoverController,
	EmojiPopoverController,
	ImageEditPopoverController,
	ImageSwapPopoverController,
	LinkPopoverController,
	MentionPopoverController,
	TableQuickActionsPopoverController,
	TemplateVariablePopoverController,
	VideoEditPopoverController,
	VideoSwapPopoverController,
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
	AudioEditPopover,
	AudioSwapPopover,
	BlockResizePopover,
	CodeBlockPopover,
	EmbedEditPopover,
	EmbedSwapPopover,
	EmojiPopover,
	ImageEditPopover,
	ImageSwapPopover,
	LinkPopover,
	MentionPopover,
	TableQuickActionsPopover,
	TemplateVariablePopover,
	VideoEditPopover,
	VideoSwapPopover,
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
	audioEditPopoverController: AudioEditPopoverController;
	audioSwapPopoverController: AudioSwapPopoverController;
	blockResizePopoverController: BlockResizePopoverController;
	codeBlockPopoverController: CodeBlockPopoverController;
	embedEditPopoverController: EmbedEditPopoverController;
	embedSwapPopoverController: EmbedSwapPopoverController;
	emojiPopoverController: EmojiPopoverController;
	imageEditPopoverController: ImageEditPopoverController;
	imageSwapPopoverController: ImageSwapPopoverController;
	linkPopoverController: LinkPopoverController;
	mentionPopoverController: MentionPopoverController;
	tableQuickActionsPopoverController: TableQuickActionsPopoverController;
	templateVariablePopoverController: TemplateVariablePopoverController;
	videoEditPopoverController: VideoEditPopoverController;
	videoSwapPopoverController: VideoSwapPopoverController;
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
		audioEditPopoverController: props.audioEditPopoverController,
		audioSwapPopoverController: props.audioSwapPopoverController,
		blockResizePopoverController: props.blockResizePopoverController,
		codeBlockPopoverController: props.codeBlockPopoverController,
		embedEditPopoverController: props.embedEditPopoverController,
		embedSwapPopoverController: props.embedSwapPopoverController,
		emojiPopoverController: props.emojiPopoverController,
		imageEditPopoverController: props.imageEditPopoverController,
		imageSwapPopoverController: props.imageSwapPopoverController,
		linkPopoverController: props.linkPopoverController,
		mentionPopoverController: props.mentionPopoverController,
		tableQuickActionsPopoverController:
			props.tableQuickActionsPopoverController,
		templateVariablePopoverController: props.templateVariablePopoverController,
		videoEditPopoverController: props.videoEditPopoverController,
		videoSwapPopoverController: props.videoSwapPopoverController,
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
				<div class="relative max-h-300 overflow-y-auto">
					<div>{props.richTextArea}</div>
					<div>
						<PopoverControllersContext.Provider
							value={popoverControllersContextValue}
						>
							<AudioEditPopover />
							<AudioSwapPopover />
							<BlockResizePopover />
							<CodeBlockPopover />
							<EmbedEditPopover />
							<EmbedSwapPopover />
							<EmojiPopover />
							<ImageEditPopover />
							<ImageSwapPopover />
							<LinkPopover />
							<MentionPopover />
							<TableQuickActionsPopover />
							<TemplateVariablePopover />
							<VideoEditPopover />
							<VideoSwapPopover />
						</PopoverControllersContext.Provider>
					</div>
				</div>
			</EditorContainer>
		</EditorOptionsContext.Provider>
	);
};
