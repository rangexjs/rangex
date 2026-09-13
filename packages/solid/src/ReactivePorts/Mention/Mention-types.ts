import type {
	MentionSuggestionItem,
	MentionSuggestionItems,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveMentionPort {
	readonly caretMenuEl: HTMLDivElement;

	filteredItems: Accessor<MentionSuggestionItems>;
	caretMenuOpen: Accessor<boolean>;

	select(item: MentionSuggestionItem): void;
}
