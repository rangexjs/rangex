import type { MentionSuggestionItems } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveMentionPort {
	filteredItems: Accessor<MentionSuggestionItems>;
}
