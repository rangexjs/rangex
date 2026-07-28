import type { StoredSnapshot } from "rich-text-area";
import type { ConfigureExtensionFn, ToolbarButtons } from "#ports";
import type {
	AccordionItem,
	Audio,
	BlockQuote,
	CodeBlock,
	Embed,
	Emoji,
	EmptyMedia,
	FindReplace,
	Formatting,
	Image,
	Link,
	List,
	Mention,
	ReadOnly,
	Symbols,
	Table,
	TemplateVariable,
	TodoList,
	UndoRedo,
	Video,
} from "../Extensions";

export type ExtensionUnion =
	| ReturnType<typeof AccordionItem>
	| ReturnType<typeof Audio>
	| ReturnType<typeof BlockQuote>
	| ReturnType<typeof CodeBlock>
	| ReturnType<typeof Embed>
	| ReturnType<typeof Emoji>
	| ReturnType<typeof EmptyMedia>
	| ReturnType<typeof FindReplace>
	| ReturnType<typeof Formatting>
	| ReturnType<typeof Image>
	| ReturnType<typeof Link>
	| ReturnType<typeof List>
	| ReturnType<typeof Mention>
	| ReturnType<typeof ReadOnly>
	| ReturnType<typeof Symbols>
	| ReturnType<typeof Table>
	| ReturnType<typeof TemplateVariable>
	| ReturnType<typeof TodoList>
	| ReturnType<typeof UndoRedo>
	| ReturnType<typeof Video>;

// biome-ignore lint/suspicious/noExplicitAny: extension/adapter correlation can't be expressed across the union
export type ErasedConfigureExtensionFn = ConfigureExtensionFn<any>;

export type Extensions = ExtensionUnion[];

export interface RichTextEditorParams {
	storedSnapshot?: StoredSnapshot;
	toolbarButtons?: ToolbarButtons;
	extensions: Extensions;
}
