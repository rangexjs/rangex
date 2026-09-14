import type { CommandMenuSuggestionItems } from "@rangex/editor";
import type { Accessor } from "solid-js";
import type { ReactiveCaretMenuPort } from "../../_Utilities";

export interface ReactiveCommandMenuPort {
	readonly caretMenu: ReactiveCaretMenuPort;

	filteredItems: Accessor<CommandMenuSuggestionItems>;

	beforeSelect(): void;
}
