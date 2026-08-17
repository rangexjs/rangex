import type { CommandMenuItemValue, CreateAdapterConstructor } from "#ports";

export interface CommandMenuSettings {
	items?: CommandMenuItemValue[];
}

export type CommandMenuAdapterConstructorParams =
	CreateAdapterConstructor<CommandMenuSettings>;

export interface CommandMenuState {
	allowedItems?: CommandMenuItemValue[];
	query?: string;
	isOpen?: boolean;
}

export interface UpdateCommandMenuStateParams extends CommandMenuState {}

export type CommandMenuUpdateFilteredItemsFn = (
	value: Set<CommandMenuItemValue>,
) => void;
export type CommandMenuUpdateIsOpenFn = (value: boolean) => void;

export interface CommandMenuUIPort {
	readonly items: CommandMenuItemValue[];
	readonly filteredItems: Set<CommandMenuItemValue>;
	onFilteredItemsUpdate(callback: CommandMenuUpdateFilteredItemsFn): () => void;
	readonly isOpen: boolean;
	onIsOpenUpdate(callback: CommandMenuUpdateIsOpenFn): () => void;
	setAnchoredOverlay(element: HTMLDivElement): void;
	emitBeforeSelect(): void;
}

export type CommandMenuOnBeforeSelectFn = () => void;

export interface CommandMenuEditorPort {
	readonly anchoredOverlay: HTMLDivElement;
	readonly filteredItems: Set<CommandMenuItemValue>;
	updateState(params: UpdateCommandMenuStateParams): void;
	onBeforeSelect(callback: CommandMenuOnBeforeSelectFn): () => void;
}
