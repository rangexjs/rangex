import type { CaretMenuQuery, EmojiSuggestionItems } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveEmojiPort {
	query: Accessor<CaretMenuQuery>;
	items: EmojiSuggestionItems;
}
