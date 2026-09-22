import type { CommandMenuSuggestionItems } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveCommandMenuPort {
	filteredItems: Accessor<CommandMenuSuggestionItems>;
}
