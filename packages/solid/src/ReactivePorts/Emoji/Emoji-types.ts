import type { EmojiSuggestionItem, EmojiSuggestionItems } from "@rangex/editor";
import type { Accessor } from "solid-js";
import type { ReactiveCaretMenuPort } from "../../_Utilities";

export interface ReactiveEmojiPort {
	readonly caretMenu: ReactiveCaretMenuPort;

	filteredItems: Accessor<EmojiSuggestionItems>;

	select(item: EmojiSuggestionItem): void;
}
