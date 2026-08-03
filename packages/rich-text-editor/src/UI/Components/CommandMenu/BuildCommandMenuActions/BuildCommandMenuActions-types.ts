import type { CommandMenuItemValue } from "#ports";
import type { IconName } from "../../Icon";

export interface CommandMenuAction {
	icon: IconName;
	onSelect: () => void;
}

export interface CommandMenuItemEntry {
	name: CommandMenuItemValue;
	action: CommandMenuAction;
}

export interface BuildCommandMenuActionsParams {
	items: CommandMenuItemValue[];
}
