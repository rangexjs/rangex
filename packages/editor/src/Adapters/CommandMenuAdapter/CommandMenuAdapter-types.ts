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
	| "media"
	| "accordion-item"
	| "separator";

export interface SuggestionItem {
	value: CommandMenuItemValue;
	label: string;
}

export type SuggestionItems = SuggestionItem[];

export interface CommandMenuState {
	query?: string;
}

export interface UpdateStateParams extends CommandMenuState {}

export type OnBeforeSelectCallbackFn = () => void;

export interface CommandMenuConfigPortProps {
	readonly filteredItems: SuggestionItems;

	updateState(params: UpdateStateParams): void;

	onBeforeSelect(callback: OnBeforeSelectCallbackFn): () => void;
}

export interface CommandMenuConfigPort
	extends CommandMenuConfigPortProps,
		CaretMenuConfigPort {}

export type OnFilteredItemsUpdateCallbackFn = (value: SuggestionItems) => void;

export interface CommandMenuPublicPortProps {
	readonly filteredItems: SuggestionItems;

	onFilteredItemsUpdate(callback: OnFilteredItemsUpdateCallbackFn): () => void;

	beforeSelect(): void;
}

export interface CommandMenuPublicPort
	extends CommandMenuPublicPortProps,
		CaretMenuPublicPort {}

export interface CommandMenuInternals {
	items: SuggestionItems;
	query: string;
	filteredItems: SuggestionItems;
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
