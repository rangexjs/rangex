import type { RangeXEditor } from "@rangex/editor";
import type { ReactiveAccordionItemPort } from "../ReactivePorts/AccordionItem";
import type { ReactiveAudioPort } from "../ReactivePorts/Audio";
import type { ReactiveCodeBlockPort } from "../ReactivePorts/CodeBlock";
import type { ReactiveCommandMenuPort } from "../ReactivePorts/CommandMenu";
import type { ReactiveEmbedPort } from "../ReactivePorts/Embed";
import type { ReactiveEmojiPort } from "../ReactivePorts/Emoji";
import type { ReactiveEmptyMediaPort } from "../ReactivePorts/EmptyMedia";
import type { ReactiveFindReplacePort } from "../ReactivePorts/FindReplace";
import type { ReactiveFormattingPort } from "../ReactivePorts/Formatting";
import type { ReactiveImagePort } from "../ReactivePorts/Image";
import type { ReactiveListPort } from "../ReactivePorts/List";
import type { ReactiveMentionPort } from "../ReactivePorts/Mention";
import type { ReactiveReadOnlyPort } from "../ReactivePorts/ReadOnly";
import type { ReactiveSeparatorPort } from "../ReactivePorts/Separator";
import type { ReactiveSymbolsPort } from "../ReactivePorts/Symbols";
import type { ReactiveTemplateVariablePort } from "../ReactivePorts/TemplateVariable";
import type { ReactiveTodoListPort } from "../ReactivePorts/TodoList";
import type { ReactiveUndoRedoPort } from "../ReactivePorts/UndoRedo";
import type { ReactiveVideoPort } from "../ReactivePorts/Video";

export interface ReactiveEditor {
	accordionItem?: ReactiveAccordionItemPort;
	audio?: ReactiveAudioPort;
	codeBlock?: ReactiveCodeBlockPort;
	commandMenu?: ReactiveCommandMenuPort;
	embed?: ReactiveEmbedPort;
	emoji?: ReactiveEmojiPort;
	emptyMedia?: ReactiveEmptyMediaPort;
	findReplace?: ReactiveFindReplacePort;
	formatting?: ReactiveFormattingPort;
	image?: ReactiveImagePort;
	list?: ReactiveListPort;
	mention?: ReactiveMentionPort;
	readOnly?: ReactiveReadOnlyPort;
	separator?: ReactiveSeparatorPort;
	symbols?: ReactiveSymbolsPort;
	templateVariable?: ReactiveTemplateVariablePort;
	todoList?: ReactiveTodoListPort;
	undoRedo?: ReactiveUndoRedoPort;
	video?: ReactiveVideoPort;
}

export interface CreateReactiveEditorParams {
	editor: RangeXEditor;
}

export interface CreateReactiveEditorResult {
	reactiveEditor: ReactiveEditor;
	disposeList: Set<() => void>;
}
