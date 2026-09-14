import type {
	MentionSuggestionItem,
	MentionSuggestionItems,
} from "@rangex/editor";
import type { Accessor } from "solid-js";
import type { ReactiveCaretMenuPort } from "../../_Utilities";

export interface ReactiveMentionPort {
	readonly caretMenu: ReactiveCaretMenuPort;

	filteredItems: Accessor<MentionSuggestionItems>;

	select(item: MentionSuggestionItem): void;
}
