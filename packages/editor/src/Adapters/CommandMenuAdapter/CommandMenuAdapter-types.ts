import type { CaretMenuConfigPort, CaretMenuPublicPort, CreateAdapterParams } from "../_Utilities";

export type CommandMenuItemValue =
	| "p"
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "unordered-list"
	| "ordered-list"
	| "todo-list"
	| "block-quote"
	| "code-block"
	| "table"
	| "media"
	| "accordion-item"
	| "separator";

export type CommandMenuAvailableItems = CommandMenuItemValue[];

export interface CommandMenuState {
	availableItems?: CommandMenuAvailableItems;
}

export type OnBeforeSelectCallbackFn = () => void;

export type OnAvailableItemsUpdateCallbackFn = (availableItems: CommandMenuAvailableItems) => void;

export interface UpdateStateParams extends CommandMenuState {}

export interface CommandMenuConfigPortProps {
	readonly caretMenu: CaretMenuConfigPort;

	updateState(params: UpdateStateParams): void;
	onBeforeSelect(callback: OnBeforeSelectCallbackFn): () => void;
}

export interface CommandMenuConfigPort extends CommandMenuConfigPortProps {}

export interface CommandMenuPublicPortProps {
	readonly caretMenu: CaretMenuPublicPort;
	readonly availableItems: CommandMenuAvailableItems;

	onAvailableItemsUpdate(callback: OnAvailableItemsUpdateCallbackFn): () => void;
	beforeSelect(): void;
}

export interface CommandMenuPublicPort extends CommandMenuPublicPortProps {}

export interface CommandMenuAdapter {
	configPort: CommandMenuConfigPort;
	publicPort: CommandMenuPublicPort;
}

export interface CommandMenuSettings {}

export interface CreateCommandMenuAdapterParams extends CreateAdapterParams<CommandMenuSettings> {}

export interface CreateCommandMenuAdapterResult extends CommandMenuAdapter {}
