import type { Component } from "solid-js";
import { For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import {
	type ExtensionName,
	type ToolbarButtons,
	type ToolbarButtonValue,
	toolbarButtonsName,
	type UIExtension,
} from "#ports";
import {
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
	IndentationToolbarButton,
	ItalicToolbarButton,
	LetterSpacingToolbarButton,
	LineHeightToolbarButton,
	LineLocalNameToolbarButton,
	LineSpacingToolbarButton,
	MediaToolbarButton,
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
} from "../ToolbarButtons";

type StaticToolbarButtonValue = Exclude<
	ToolbarButtonValue,
	typeof toolbarButtonsName.link | ExtensionName
>;

const findExtensionToolbarButton = (
	name: ToolbarButtonValue,
	extensions: UIExtension[],
) => {
	for (const extension of extensions) {
		const component = extension.components.toolbarButtons?.[name];

		if (component) {
			return { component, uiPort: extension.uiPort };
		}
	}

	return null;
};

interface ToolbarButtonProps {
	name: ToolbarButtonValue;
	extensions: UIExtension[];
}

const ToolbarButton = ({ name, extensions }: ToolbarButtonProps) => {
	const ToolbarButtonComponentMap: Record<StaticToolbarButtonValue, Component> =
		{
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
			[toolbarButtonsName.indentation]: IndentationToolbarButton,
			[toolbarButtonsName.media]: MediaToolbarButton,
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
			[toolbarButtonsName.textAreaReadability]:
				TextAreaReadabilityToolbarButton,
			[toolbarButtonsName.underline]: UnderlineToolbarButton,
			[toolbarButtonsName.unorderedList]: UnorderedListToolbarButton,
		};

	const match = findExtensionToolbarButton(name, extensions);

	if (!match) {
		return (
			<Dynamic
				component={ToolbarButtonComponentMap[name as StaticToolbarButtonValue]}
			/>
		);
	}

	return <Dynamic component={match.component} uiPort={match.uiPort} />;
};

export interface EditorToolbarProps {
	toolbarButtons: ToolbarButtons;
	extensions: UIExtension[];
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
											{(name) => (
												<ToolbarButton
													name={name}
													extensions={props.extensions}
												/>
											)}
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
