import type { CommandMenuSuggestionItems } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveCommandMenuPort {
	readonly caretMenuEl: HTMLDivElement;

	filteredItems: Accessor<CommandMenuSuggestionItems>;
	caretMenuOpen: Accessor<boolean>;

	beforeSelect(): void;
}

export interface ReactiveCommandMenuResult {
	port: ReactiveCommandMenuPort;
	dispose: () => void;
}
