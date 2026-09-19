import type { CommandMenuItemValue, RangeXEditor } from "@rangex/editor";
import type { CodeBlockOptions } from "#context";
import type { IconName } from "#ui";

export interface CommandMenuAction {
	icon: IconName;
	onSelect: () => void;
}

export type CommandActions = Map<CommandMenuItemValue, CommandMenuAction>;

export interface BuildCommandMenuActionsParams {
	editor: RangeXEditor;
	options: CodeBlockOptions;
}

export type BuildCommandMenuActionsResult = CommandActions;
