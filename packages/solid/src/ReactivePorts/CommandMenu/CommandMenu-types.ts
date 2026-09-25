import type { CommandMenuSuggestionItems } from "@rangex/editor";
import type { ReactiveCaretMenuPort } from "../_Utilities";

export interface ReactiveCommandMenuPort {
	caretMenu: ReactiveCaretMenuPort;
	items: CommandMenuSuggestionItems;
}
