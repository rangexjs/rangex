import { extendObjectProperties } from "#utilities";
import { createCaretMenuPort, createEmitter } from "../_Utilities";
import { defaultEmojiItems } from "./EmojiAdapter-default";
import type {
	CreateEmojiAdapterParams,
	CreateEmojiAdapterResult,
	EmojiConfigPort,
	EmojiConfigPortProps,
	EmojiInternals,
	EmojiPublicPort,
	EmojiPublicPortProps,
	OnSelectCallbackFn,
	SuggestionItem,
} from "./EmojiAdapter-types";

export const createEmojiAdapter = (
	...params: CreateEmojiAdapterParams
): CreateEmojiAdapterResult => {
	const [{ items = defaultEmojiItems }, { floatingContainer }] = params;

	const internals: EmojiInternals = {
		// Rest
		items,
	};

	// CommandListeners
	const selectEmitter = createEmitter<OnSelectCallbackFn>();

	const caretMenuPort = createCaretMenuPort({ floatingContainer });

	const configPort: EmojiConfigPort = extendObjectProperties({}, {
		get caretMenu() {
			return caretMenuPort.configPort;
		},

		onSelect(callback) {
			return selectEmitter.subscribe(callback);
		},

		findByName(name) {
			return internals.items.find((item) => item.name === name.toLowerCase());
		},
	} satisfies EmojiConfigPortProps);

	const publicPort: EmojiPublicPort = extendObjectProperties({}, {
		get caretMenu() {
			return caretMenuPort.publicPort;
		},

		get items() {
			return internals.items;
		},

		select(item: SuggestionItem) {
			selectEmitter.emit(item);
		},
	} satisfies EmojiPublicPortProps);

	return { configPort, publicPort };
};
