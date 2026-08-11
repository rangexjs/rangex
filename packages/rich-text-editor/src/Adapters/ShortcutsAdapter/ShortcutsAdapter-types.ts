import type { CreateAdapterConstructor } from "#ports";

export type ShortcutsAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export type ShortcutsUIPort = Record<string, never>;

export type ShortcutsEditorPort = Record<string, never>;
