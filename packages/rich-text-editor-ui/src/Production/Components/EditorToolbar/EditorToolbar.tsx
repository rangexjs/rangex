import { For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { ToolbarButtons } from "../../CommonTypes";
import { type ToolbarButtonValue, toolbarButtonsName } from "../../Constants";
import {
	AnchorToolbarButton,
	BackgroundColorToolbarButton,
	BlockQuoteToolbarButton,
	BoldToolbarButton,
	CheckboxListToolbarButton,
	CodeBlockToolbarButton,
	CodeToolbarButton,
	ColorToolbarButton,
	CustomComponentToolbarButton,
	FindReplaceToolbarButton,
	FontFamilyToolbarButton,
	FontSizeToolbarButton,
	HistoryBackToolbarButton,
	HistoryForwardToolbarButton,
	ImageToolbarButton,
	IndentationToolbarButton,
	ItalicToolbarButton,
	LetterSpacingToolbarButton,
	LineHeightToolbarButton,
	LineLocalNameToolbarButton,
	LineSpacingToolbarButton,
	OrderedListToolbarButton,
	RemoveFormatToolbarButton,
	StrikethroughToolbarButton,
	SubscriptToolbarButton,
	SuperscriptToolbarButton,
	SymbolsToolbarButton,
	TableToolbarButton,
	TemplateVariableToolbarButton,
	TextAlignToolbarButton,
	TextAreaReadabilityToolbarButton,
	UnderlineToolbarButton,
	UnorderedListToolbarButton,
	VideoToolbarButton,
} from "../ToolbarButtons";

interface ToolbarButtonProps {
	name: ToolbarButtonValue;
}

const ToolbarButton = ({ name }: ToolbarButtonProps) => {
	const ToolbarButtonComponentMap = {
		[toolbarButtonsName.anchor]: AnchorToolbarButton,
		[toolbarButtonsName.backgroundColor]: BackgroundColorToolbarButton,
		[toolbarButtonsName.blockQuote]: BlockQuoteToolbarButton,
		[toolbarButtonsName.bold]: BoldToolbarButton,
		[toolbarButtonsName.checkboxList]: CheckboxListToolbarButton,
		[toolbarButtonsName.code]: CodeToolbarButton,
		[toolbarButtonsName.codeBlock]: CodeBlockToolbarButton,
		[toolbarButtonsName.color]: ColorToolbarButton,
		[toolbarButtonsName.customComponent]: CustomComponentToolbarButton,
		[toolbarButtonsName.fontFamily]: FontFamilyToolbarButton,
		[toolbarButtonsName.fontSize]: FontSizeToolbarButton,
		[toolbarButtonsName.historyBack]: HistoryBackToolbarButton,
		[toolbarButtonsName.historyForward]: HistoryForwardToolbarButton,
		[toolbarButtonsName.image]: ImageToolbarButton,
		[toolbarButtonsName.indentation]: IndentationToolbarButton,
		[toolbarButtonsName.italic]: ItalicToolbarButton,
		[toolbarButtonsName.letterSpacing]: LetterSpacingToolbarButton,
		[toolbarButtonsName.lineHeight]: LineHeightToolbarButton,
		[toolbarButtonsName.lineLocalName]: LineLocalNameToolbarButton,
		[toolbarButtonsName.lineSpacing]: LineSpacingToolbarButton,
		[toolbarButtonsName.removeFormat]: RemoveFormatToolbarButton,
		[toolbarButtonsName.orderedList]: OrderedListToolbarButton,
		[toolbarButtonsName.findReplace]: FindReplaceToolbarButton,
		[toolbarButtonsName.subscript]: SubscriptToolbarButton,
		[toolbarButtonsName.superscript]: SuperscriptToolbarButton,
		[toolbarButtonsName.strikethrough]: StrikethroughToolbarButton,
		[toolbarButtonsName.symbols]: SymbolsToolbarButton,
		[toolbarButtonsName.table]: TableToolbarButton,
		[toolbarButtonsName.templateVariable]: TemplateVariableToolbarButton,
		[toolbarButtonsName.textAlign]: TextAlignToolbarButton,
		[toolbarButtonsName.textAreaReadability]: TextAreaReadabilityToolbarButton,
		[toolbarButtonsName.underline]: UnderlineToolbarButton,
		[toolbarButtonsName.unorderedList]: UnorderedListToolbarButton,
		[toolbarButtonsName.video]: VideoToolbarButton,
	} as const;

	return <Dynamic component={ToolbarButtonComponentMap[name]} />;
};

export interface EditorToolbarProps {
	toolbarButtons: ToolbarButtons;
}

export const EditorToolbar = (props: EditorToolbarProps) => {
	return (
		<div class="flex flex-col gap-1 border-neutral-200 border-b bg-white p-2 dark:border-neutral-800 dark:bg-neutral-950">
			<For each={props.toolbarButtons}>
				{(row) => (
					<div class="flex flex-wrap gap-1.5">
						<For each={row}>
							{(group, index) => (
								<>
									<span class="space-x-0.5">
										<For each={group}>
											{(name) => <ToolbarButton name={name} />}
										</For>
									</span>
									<Show when={index() < row.length - 1}>
										<span class="w-px bg-neutral-200 dark:bg-neutral-700" />
									</Show>
								</>
							)}
						</For>
					</div>
				)}
			</For>
		</div>
	);
};
