import type { AccordionItemAdapter } from "../AccordionItemAdapter";
import type { AudioAdapter } from "../AudioAdapter";
import type { BlockQuoteAdapter } from "../BlockQuoteAdapter";
import type { CodeBlockAdapter } from "../CodeBlockAdapter";
import type { CommandMenuAdapter } from "../CommandMenuAdapter";
import type { EmbedAdapter } from "../EmbedAdapter";
import type { EmojiAdapter } from "../EmojiAdapter";
import type { EmptyMediaAdapter } from "../EmptyMediaAdapter";
import type { FindReplaceAdapter } from "../FindReplaceAdapter";
import type { FormattingAdapter } from "../FormattingAdapter";
import type { ImageAdapter } from "../ImageAdapter";
import type { LineHandlerAdapter } from "../LineHandlerAdapter";
import type { LinkAdapter } from "../LinkAdapter";
import type { ListAdapter } from "../ListAdapter";
import type { MarkdownAdapter } from "../MarkdownAdapter";
import type { MentionAdapter } from "../MentionAdapter";
import type { ReadOnlyAdapter } from "../ReadOnlyAdapter";
import type { SeparatorAdapter } from "../SeparatorAdapter";
import type { ShortcutsAdapter } from "../ShortcutsAdapter";
import type { SymbolsAdapter } from "../SymbolsAdapter";
import type { TableAdapter } from "../TableAdapter";
import type { TemplateVariableAdapter } from "../TemplateVariableAdapter";
import type { TodoListAdapter } from "../TodoListAdapter";
import type { UndoRedoAdapter } from "../UndoRedoAdapter";
import type { VideoAdapter } from "../VideoAdapter";
import type { AdapterBus } from "./AdapterBus";

export interface AdapterOptions {
	adapterBus: AdapterBus;
	floatingContainer: HTMLDivElement;
}

export type CreateAdapterParams<Settings extends object> = [
	Settings,
	AdapterOptions,
];

export interface AdapterMap {
	accordionItem: AccordionItemAdapter;
	audio: AudioAdapter;
	blockQuote: BlockQuoteAdapter;
	codeBlock: CodeBlockAdapter;
	commandMenu: CommandMenuAdapter;
	embed: EmbedAdapter;
	emoji: EmojiAdapter;
	emptyMedia: EmptyMediaAdapter;
	findReplace: FindReplaceAdapter;
	formatting: FormattingAdapter;
	image: ImageAdapter;
	lineHandler: LineHandlerAdapter;
	link: LinkAdapter;
	list: ListAdapter;
	markdown: MarkdownAdapter;
	mention: MentionAdapter;
	readOnly: ReadOnlyAdapter;
	separator: SeparatorAdapter;
	shortcuts: ShortcutsAdapter;
	symbols: SymbolsAdapter;
	table: TableAdapter;
	templateVariable: TemplateVariableAdapter;
	todoList: TodoListAdapter;
	undoRedo: UndoRedoAdapter;
	video: VideoAdapter;
}

export type AdapterName = keyof AdapterMap;

export type Adapter = AdapterMap[AdapterName];

export type AdapterPublicPorts = {
	[Name in AdapterName]: AdapterMap[Name]["publicPort"];
};
