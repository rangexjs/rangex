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
	CheckboxListToolbarButton,
	CustomComponentToolbarButton,
	FindReplaceToolbarButton,
	HistoryBackToolbarButton,
	HistoryForwardToolbarButton,
	OrderedListToolbarButton,
	SymbolsToolbarButton,
	TableToolbarButton,
	TemplateVariableToolbarButton,
	TextAreaReadabilityToolbarButton,
	UnorderedListToolbarButton,
} from "../ToolbarButtons";

type StaticToolbarButtonValue = Exclude<
	ToolbarButtonValue,
	| typeof toolbarButtonsName.link
	| typeof toolbarButtonsName.media
	| typeof toolbarButtonsName.backgroundColor
	| typeof toolbarButtonsName.blockQuote
	| typeof toolbarButtonsName.bold
	| typeof toolbarButtonsName.code
	| typeof toolbarButtonsName.codeBlock
	| typeof toolbarButtonsName.color
	| typeof toolbarButtonsName.fontFamily
	| typeof toolbarButtonsName.fontSize
	| typeof toolbarButtonsName.indentation
	| typeof toolbarButtonsName.italic
	| typeof toolbarButtonsName.letterSpacing
	| typeof toolbarButtonsName.lineHeight
	| typeof toolbarButtonsName.lineLocalName
	| typeof toolbarButtonsName.lineSpacing
	| typeof toolbarButtonsName.removeFormat
	| typeof toolbarButtonsName.strikethrough
	| typeof toolbarButtonsName.subscript
	| typeof toolbarButtonsName.superscript
	| typeof toolbarButtonsName.textAlign
	| typeof toolbarButtonsName.underline
	| ExtensionName
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
			[toolbarButtonsName.checkboxList]: CheckboxListToolbarButton,
			[toolbarButtonsName.customComponent]: CustomComponentToolbarButton,
			[toolbarButtonsName.historyBack]: HistoryBackToolbarButton,
			[toolbarButtonsName.historyForward]: HistoryForwardToolbarButton,
			[toolbarButtonsName.orderedList]: OrderedListToolbarButton,
			[toolbarButtonsName.findReplace]: FindReplaceToolbarButton,
			[toolbarButtonsName.symbols]: SymbolsToolbarButton,
			[toolbarButtonsName.table]: TableToolbarButton,
			[toolbarButtonsName.templateVariable]: TemplateVariableToolbarButton,
			[toolbarButtonsName.textAreaReadability]:
				TextAreaReadabilityToolbarButton,
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
