import type { CommandMenuItemValue, CreateAdapterConstructor } from "#ports";

export interface CommandMenuSettings {
	items: CommandMenuItemValue[];
}

export type CommandMenuAdapterConstructorParams =
	CreateAdapterConstructor<CommandMenuSettings>;

export interface CommandMenuState {
	allowedItems?: CommandMenuItemValue[];
	query?: string;
}

export interface UpdateCommandMenuStateParams extends CommandMenuState {}

export type CommandMenuUpdateFilteredItemsFn = (
	value: Set<CommandMenuItemValue>,
) => void;

export interface CommandMenuUIPort {
	readonly items: CommandMenuItemValue[];
	readonly filteredItems: Set<CommandMenuItemValue>;
	onFilteredItemsUpdate(callback: CommandMenuUpdateFilteredItemsFn): () => void;
	setPopover(element: HTMLDivElement): void;
	emitBeforeSelect(): void;
}

export type CommandMenuOnBeforeSelectFn = () => void;

export interface CommandMenuEditorPort {
	readonly popover: HTMLDivElement;
	readonly filteredItems: Set<CommandMenuItemValue>;
	updateState(params: UpdateCommandMenuStateParams): void;
	onBeforeSelect(callback: CommandMenuOnBeforeSelectFn): () => void;
}
