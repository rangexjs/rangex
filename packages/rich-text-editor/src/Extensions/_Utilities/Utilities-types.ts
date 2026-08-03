import type { AccordionItem } from "../AccordionItem";
import type { Audio } from "../Audio";
import type { BlockQuote } from "../BlockQuote";
import type { CodeBlock } from "../CodeBlock";
import type { CommandMenu } from "../CommandMenu";
import type { Embed } from "../Embed";
import type { Emoji } from "../Emoji";
import type { EmptyMedia } from "../EmptyMedia";
import type { FindReplace } from "../FindReplace";
import type { Formatting } from "../Formatting";
import type { Image } from "../Image";
import type { LineHandler } from "../LineHandler";
import type { Link } from "../Link";
import type { List } from "../List";
import type { Mention } from "../Mention";
import type { ReadOnly } from "../ReadOnly";
import type { Symbols } from "../Symbols";
import type { Table } from "../Table";
import type { TemplateVariable } from "../TemplateVariable";
import type { TodoList } from "../TodoList";
import type { UndoRedo } from "../UndoRedo";
import type { Video } from "../Video";

export type ExtensionValue =
	| ReturnType<typeof AccordionItem>
	| ReturnType<typeof Audio>
	| ReturnType<typeof BlockQuote>
	| ReturnType<typeof CodeBlock>
	| ReturnType<typeof CommandMenu>
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
	| ReturnType<typeof Video>
	| ReturnType<typeof LineHandler>;
