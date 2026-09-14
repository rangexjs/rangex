import type { EmojiSuggestionItems } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveEmojiPort {
	filteredItems: Accessor<EmojiSuggestionItems>;
}
