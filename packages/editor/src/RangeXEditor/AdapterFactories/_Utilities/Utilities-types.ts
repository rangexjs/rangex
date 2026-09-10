import type { AccordionItem } from "../AccordionItem";
import type { Audio } from "../Audio";
import type { CodeBlock } from "../CodeBlock";
import type { CommandMenu } from "../CommandMenu";
import type { Embed } from "../Embed";
import type { Emoji } from "../Emoji";
import type { EmptyMedia } from "../EmptyMedia";
import type { FindReplace } from "../FindReplace";
import type { Formatting } from "../Formatting";
import type { Image } from "../Image";
import type { List } from "../List";
import type { Markdown } from "../Markdown";
import type { Mention } from "../Mention";
import type { ReadOnly } from "../ReadOnly";
import type { Separator } from "../Separator";
import type { Shortcuts } from "../Shortcuts";
import type { Symbols } from "../Symbols";
import type { TemplateVariable } from "../TemplateVariable";
import type { TodoList } from "../TodoList";
import type { UndoRedo } from "../UndoRedo";
import type { Video } from "../Video";

export type AdapterFactory =
	| typeof AccordionItem
	| typeof Audio
	| typeof CodeBlock
	| typeof CommandMenu
	| typeof Embed
	| typeof Emoji
	| typeof EmptyMedia
	| typeof FindReplace
	| typeof Formatting
	| typeof Image
	| typeof List
	| typeof Markdown
	| typeof Mention
	| typeof ReadOnly
	| typeof Separator
	| typeof Shortcuts
	| typeof Symbols
	| typeof TemplateVariable
	| typeof TodoList
	| typeof UndoRedo
	| typeof Video;

export type AdapterFactoryValue = ReturnType<AdapterFactory>;
