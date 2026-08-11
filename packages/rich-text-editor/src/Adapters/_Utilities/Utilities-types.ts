import type {
	AccordionItemAdapter,
	AccordionItemUIPort,
} from "../AccordionItemAdapter";
import type { AudioAdapter, AudioUIPort } from "../AudioAdapter";
import type { BlockQuoteAdapter, BlockQuoteUIPort } from "../BlockQuoteAdapter";
import type { CodeBlockAdapter, CodeBlockUIPort } from "../CodeBlockAdapter";
import type {
	CommandMenuAdapter,
	CommandMenuUIPort,
} from "../CommandMenuAdapter";
import type { EmbedAdapter, EmbedUIPort } from "../EmbedAdapter";
import type { EmojiAdapter, EmojiUIPort } from "../EmojiAdapter";
import type { EmptyMediaAdapter, EmptyMediaUIPort } from "../EmptyMediaAdapter";
import type {
	FindReplaceAdapter,
	FindReplaceUIPort,
} from "../FindReplaceAdapter";
import type { FormattingAdapter, FormattingUIPort } from "../FormattingAdapter";
import type { ImageAdapter, ImageUIPort } from "../ImageAdapter";
import type {
	LineHandlerAdapter,
	LineHandlerUIPort,
} from "../LineHandlerAdapter";
import type { LinkAdapter, LinkUIPort } from "../LinkAdapter";
import type { ListAdapter, ListUIPort } from "../ListAdapter";
import type { MarkdownAdapter, MarkdownUIPort } from "../MarkdownAdapter";
import type { MentionAdapter, MentionUIPort } from "../MentionAdapter";
import type { ReadOnlyAdapter, ReadOnlyUIPort } from "../ReadOnlyAdapter";
import type { SeparatorAdapter, SeparatorUIPort } from "../SeparatorAdapter";
import type { SymbolsAdapter, SymbolsUIPort } from "../SymbolsAdapter";
import type { TableAdapter, TableUIPort } from "../TableAdapter";
import type {
	TemplateVariableAdapter,
	TemplateVariableUIPort,
} from "../TemplateVariableAdapter";
import type { TodoListAdapter, TodoListUIPort } from "../TodoListAdapter";
import type { UndoRedoAdapter, UndoRedoUIPort } from "../UndoRedoAdapter";
import type { VideoAdapter, VideoUIPort } from "../VideoAdapter";

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
	| LineHandlerAdapter
	| LinkAdapter
	| ListAdapter
	| MarkdownAdapter
	| MentionAdapter
	| ReadOnlyAdapter
	| SeparatorAdapter
	| SymbolsAdapter
	| TableAdapter
	| TemplateVariableAdapter
	| TodoListAdapter
	| UndoRedoAdapter
	| VideoAdapter;

export interface AdapterUIPorts {
	accordionItemUIPort: AccordionItemUIPort;
	audioUIPort: AudioUIPort;
	blockQuoteUIPort: BlockQuoteUIPort;
	codeBlockUIPort: CodeBlockUIPort;
	commandMenuUIPort: CommandMenuUIPort;
	embedUIPort: EmbedUIPort;
	emojiUIPort: EmojiUIPort;
	emptyMediaUIPort: EmptyMediaUIPort;
	findReplaceUIPort: FindReplaceUIPort;
	formattingUIPort: FormattingUIPort;
	imageUIPort: ImageUIPort;
	lineHandlerUIPort: LineHandlerUIPort;
	linkUIPort: LinkUIPort;
	listUIPort: ListUIPort;
	markdownUIPort: MarkdownUIPort;
	mentionUIPort: MentionUIPort;
	readOnlyUIPort: ReadOnlyUIPort;
	separatorUIPort: SeparatorUIPort;
	symbolsUIPort: SymbolsUIPort;
	tableUIPort: TableUIPort;
	templateVariableUIPort: TemplateVariableUIPort;
	todoListUIPort: TodoListUIPort;
	undoRedoUIPort: UndoRedoUIPort;
	videoUIPort: VideoUIPort;
}
