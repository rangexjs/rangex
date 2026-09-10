import type { CommandMenuItemValue } from "@rangex/editor";
import type { IconName } from "#ui";

export interface CommandMenuAction {
	icon: IconName;
	onSelect: () => void;
}

export type CommandActions = Map<CommandMenuItemValue, CommandMenuAction>;

export type BuildCommandMenuActionsResult = CommandActions;
