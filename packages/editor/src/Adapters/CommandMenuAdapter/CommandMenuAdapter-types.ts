import type {
	CaretMenuConfigPort,
	CaretMenuPublicPort,
	CreateAdapterParams,
} from "../_Utilities";

export type CommandMenuItemValue =
	| "p"
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "bulleted-list"
	| "numbered-list"
	| "todo-list"
	| "block-quote"
	| "code-block"
	| "table"
	| "media"
	| "accordion-item"
	| "separator";

export interface CommandMenuItem {
	value: CommandMenuItemValue;
	label: string;
}

export type CommandMenuItems = CommandMenuItem[];

export type OnBeforeSelectCallbackFn = () => void;

export interface CommandMenuConfigPortProps {
	readonly caretMenu: CaretMenuConfigPort;

	onBeforeSelect(callback: OnBeforeSelectCallbackFn): () => void;
}

export interface CommandMenuConfigPort extends CommandMenuConfigPortProps {}

export interface CommandMenuPublicPortProps {
	readonly caretMenu: CaretMenuPublicPort;
	readonly items: CommandMenuItems;

	beforeSelect(): void;
}

export interface CommandMenuPublicPort extends CommandMenuPublicPortProps {}

export interface CommandMenuInternals {
	items: CommandMenuItems;
}

export interface CommandMenuAdapter {
	configPort: CommandMenuConfigPort;
	publicPort: CommandMenuPublicPort;
}

export interface CommandMenuSettings {
	items?: CommandMenuItemValue[];
}

export interface CreateCommandMenuAdapterParams
	extends CreateAdapterParams<CommandMenuSettings> {}

export interface CreateCommandMenuAdapterResult extends CommandMenuAdapter {}
