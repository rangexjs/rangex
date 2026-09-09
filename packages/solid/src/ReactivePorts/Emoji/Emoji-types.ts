import type { EmojiSuggestionItem, EmojiSuggestionItems } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveEmojiPort {
	readonly caretMenuEl: HTMLDivElement;

	filteredItems: Accessor<EmojiSuggestionItems>;
	caretMenuOpen: Accessor<boolean>;

	select(item: EmojiSuggestionItem): void;
}

export interface ReactiveEmojiResult {
	port: ReactiveEmojiPort;
	dispose: () => void;
}
