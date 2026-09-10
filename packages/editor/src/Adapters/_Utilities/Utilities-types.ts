import type {
	CodeBlockAdapter,
	CodeBlockPublicPort,
} from "#adapters/CodeBlock";
import type {
	TemplateVariableAdapter,
	TemplateVariablePublicPort,
} from "#adapters/TemplateVariable";
import type { TodoListAdapter, TodoListPublicPort } from "#adapters/TodoList";
import type { UndoRedoAdapter, UndoRedoPublicPort } from "#adapters/UndoRedo";
import type {
	AccordionItemAdapter,
	AccordionItemPublicPort,
} from "../AccordionItemAdapter";
import type { AudioAdapter, AudioPublicPort } from "../AudioAdapter";
import type {
	BlockQuoteAdapter,
	BlockQuotePublicPort,
} from "../BlockQuoteAdapter";
import type {
	CommandMenuAdapter,
	CommandMenuPublicPort,
} from "../CommandMenuAdapter";
import type { EmbedAdapter, EmbedPublicPort } from "../EmbedAdapter";
import type { EmojiAdapter, EmojiPublicPort } from "../EmojiAdapter";
import type {
	EmptyMediaAdapter,
	EmptyMediaPublicPort,
} from "../EmptyMediaAdapter";
import type {
	FindReplaceAdapter,
	FindReplacePublicPort,
} from "../FindReplaceAdapter";
import type {
	FormattingAdapter,
	FormattingPublicPort,
} from "../FormattingAdapter";
import type { ImageAdapter, ImagePublicPort } from "../ImageAdapter";
import type { ListAdapter, ListPublicPort } from "../ListAdapter";
import type { MarkdownAdapter, MarkdownPublicPort } from "../MarkdownAdapter";
import type { MentionAdapter, MentionPublicPort } from "../MentionAdapter";
import type { ReadOnlyAdapter, ReadOnlyPublicPort } from "../ReadOnlyAdapter";
import type {
	SeparatorAdapter,
	SeparatorPublicPort,
} from "../SeparatorAdapter";
import type {
	ShortcutsAdapter,
	ShortcutsPublicPort,
} from "../ShortcutsAdapter";
import type { SymbolsAdapter, SymbolsPublicPort } from "../SymbolsAdapter";
import type { VideoAdapter, VideoPublicPort } from "../VideoAdapter";
import type { AdapterBus } from "./AdapterBus";

export interface AdapterOptions {
	adapterBus: AdapterBus;
	floatingContainer: HTMLDivElement;
}

export type CreateAdapterParams<Settings extends object> = [
	Settings,
	AdapterOptions,
];

export type Adapter =
	| AccordionItemAdapter
	| AudioAdapter
	| BlockQuoteAdapter
	| CodeBlockAdapter
	| CommandMenuAdapter
	| EmbedAdapter
	| EmojiAdapter
	| EmptyMediaAdapter
	| FindReplaceAdapter
	| FormattingAdapter
	| ImageAdapter
	| ListAdapter
	| MarkdownAdapter
	| MentionAdapter
	| ReadOnlyAdapter
	| SeparatorAdapter
	| ShortcutsAdapter
	| SymbolsAdapter
	| TemplateVariableAdapter
	| TodoListAdapter
	| UndoRedoAdapter
	| VideoAdapter;

export interface AdapterPublicPorts {
	accordionItem: AccordionItemPublicPort;
	audio: AudioPublicPort;
	blockQuote: BlockQuotePublicPort;
	codeBlock: CodeBlockPublicPort;
	commandMenu: CommandMenuPublicPort;
	embed: EmbedPublicPort;
	emoji: EmojiPublicPort;
	emptyMedia: EmptyMediaPublicPort;
	findReplace: FindReplacePublicPort;
	formatting: FormattingPublicPort;
	image: ImagePublicPort;
	list: ListPublicPort;
	markdown: MarkdownPublicPort;
	mention: MentionPublicPort;
	readOnly: ReadOnlyPublicPort;
	separator: SeparatorPublicPort;
	shortcuts: ShortcutsPublicPort;
	symbols: SymbolsPublicPort;
	templateVariable: TemplateVariablePublicPort;
	todoList: TodoListPublicPort;
	undoRedo: UndoRedoPublicPort;
	video: VideoPublicPort;
}
