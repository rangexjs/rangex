import type { RangeXEditor } from "@rangex/editor";
import type { ReactiveAccordionItemPort } from "../ReactivePorts/AccordionItem";
import type { ReactiveAudioPort } from "../ReactivePorts/Audio";
import type { ReactiveCodeBlockPort } from "../ReactivePorts/CodeBlock";
import type { ReactiveEmbedPort } from "../ReactivePorts/Embed";
import type { ReactiveEmojiPort } from "../ReactivePorts/Emoji";
import type { ReactiveEmptyMediaPort } from "../ReactivePorts/EmptyMedia";
import type { ReactiveFormattingPort } from "../ReactivePorts/Formatting";
import type { ReactiveImagePort } from "../ReactivePorts/Image";
import type { ReactiveMentionPort } from "../ReactivePorts/Mention";
import type { ReactiveReadOnlyPort } from "../ReactivePorts/ReadOnly";
import type { ReactiveSeparatorPort } from "../ReactivePorts/Separator";
import type { ReactiveTemplateVariablePort } from "../ReactivePorts/TemplateVariable";
import type { ReactiveVideoPort } from "../ReactivePorts/Video";

export interface ReactiveEditor {
	accordionItem?: ReactiveAccordionItemPort;
	audio?: ReactiveAudioPort;
	codeBlock?: ReactiveCodeBlockPort;
	embed?: ReactiveEmbedPort;
	emoji?: ReactiveEmojiPort;
	emptyMedia?: ReactiveEmptyMediaPort;
	formatting?: ReactiveFormattingPort;
	image?: ReactiveImagePort;
	mention?: ReactiveMentionPort;
	readOnly?: ReactiveReadOnlyPort;
	separator?: ReactiveSeparatorPort;
	templateVariable?: ReactiveTemplateVariablePort;
	video?: ReactiveVideoPort;
}

export interface CreateReactiveEditorParams {
	editor: RangeXEditor;
}

export interface CreateReactiveEditorResult {
	reactiveEditor: ReactiveEditor;
	disposeList: Set<() => void>;
}
