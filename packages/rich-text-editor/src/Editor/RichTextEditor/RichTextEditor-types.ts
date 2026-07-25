import type { StoredSnapshot } from "rich-text-area";
import type { ConfigureExtensionFn, ToolbarButtons } from "#ports";
import type {
	Audio,
	BlockQuote,
	CodeBlock,
	Embed,
	EmptyMedia,
	Formatting,
	Image,
	Link,
	Mention,
	Video,
} from "../../Extensions";

export type ExtensionUnion =
	| ReturnType<typeof Audio>
	| ReturnType<typeof BlockQuote>
	| ReturnType<typeof CodeBlock>
	| ReturnType<typeof Embed>
	| ReturnType<typeof EmptyMedia>
	| ReturnType<typeof Formatting>
	| ReturnType<typeof Image>
	| ReturnType<typeof Link>
	| ReturnType<typeof Mention>
	| ReturnType<typeof Video>;

// biome-ignore lint/suspicious/noExplicitAny: extension/adapter correlation can't be expressed across the union
type ErasedPort = any;

export type ErasedConfigureExtensionFn = ConfigureExtensionFn<
	ErasedPort,
	ErasedPort,
	ErasedPort,
	ErasedPort
>;

export type Extensions = ExtensionUnion[];

export interface RichTextEditorParams {
	storedSnapshot?: StoredSnapshot;
	toolbarButtons?: ToolbarButtons;
	extensions: Extensions;
}
