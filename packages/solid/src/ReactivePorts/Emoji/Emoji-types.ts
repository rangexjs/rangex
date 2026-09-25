import type { EmojiSuggestionItems } from "@rangex/editor";
import type { ReactiveCaretMenuPort } from "../_Utilities";

export interface ReactiveEmojiPort {
	caretMenu: ReactiveCaretMenuPort;
	items: EmojiSuggestionItems;
}
