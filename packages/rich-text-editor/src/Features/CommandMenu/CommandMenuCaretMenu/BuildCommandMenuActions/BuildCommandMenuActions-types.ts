import type { RangeXEditor } from "@rangex/editor";
import type { CommandMenuItemValue } from "@rangex/editor/command-menu";
import type { UIOptions } from "#context";
import type { IconName } from "#ui";

export interface CommandMenuAction {
	label: string;
	keywords?: string[];
	icon: IconName;
	onSelect: () => void;
}

export type CommandActions = Map<CommandMenuItemValue, CommandMenuAction>;

export interface BuildCommandMenuActionsParams {
	editor: RangeXEditor;
	uiOptions: UIOptions;
}

export type BuildCommandMenuActionsResult = CommandActions;
