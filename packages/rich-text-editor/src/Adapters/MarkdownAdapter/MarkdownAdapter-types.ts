import type { CreateAdapterConstructor } from "#ports";

export type MarkdownAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export type MarkdownUIPort = Record<string, never>;

export type MarkdownEditorPort = Record<string, never>;
