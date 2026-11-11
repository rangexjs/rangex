import type { CaretMenuConfigPort, CaretMenuPublicPort, CreateAdapterParams } from "../_Utilities";

export interface EmojiItem {
	emoji: string;
	name: string;
}

export type EmojiItems = EmojiItem[];

export type OnSelectCallbackFn = (item: EmojiItem) => void;

export interface EmojiConfigPortProps {
	readonly caretMenu: CaretMenuConfigPort;

	onSelect(callback: OnSelectCallbackFn): () => void;

	findByName(name: string): EmojiItem | undefined;
}

export interface EmojiConfigPort extends EmojiConfigPortProps {}

export interface EmojiPublicPortProps {
	readonly caretMenu: CaretMenuPublicPort;
	readonly items: EmojiItems;

	select(item: EmojiItem): void;
}

export interface EmojiPublicPort extends EmojiPublicPortProps {}

export interface EmojiInternals {
	items: EmojiItems;
}

export interface EmojiAdapter {
	configPort: EmojiConfigPort;
	publicPort: EmojiPublicPort;
}

export interface EmojiSettings {
	items?: EmojiItems;
}

export interface CreateEmojiAdapterParams extends CreateAdapterParams<EmojiSettings> {}

export interface CreateEmojiAdapterResult extends EmojiAdapter {}
