import type {
	CaretMenuQuery,
	CommandMenuSuggestionItems,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveCommandMenuPort {
	query: Accessor<CaretMenuQuery>;
	items: CommandMenuSuggestionItems;
}
