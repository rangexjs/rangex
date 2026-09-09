import type { RangeXEditor } from "@rangex/editor";
import type { ReactiveAccordionItemPort } from "../ReactivePorts/AccordionItem";
import type { ReactiveCodeBlockPort } from "../ReactivePorts/CodeBlock";
import type { ReactiveEmptyMediaPort } from "../ReactivePorts/EmptyMedia";
import type { ReactiveFormattingPort } from "../ReactivePorts/Formatting";
import type { ReactiveImagePort } from "../ReactivePorts/Image";
import type { ReactiveReadOnlyPort } from "../ReactivePorts/ReadOnly";
import type { ReactiveSeparatorPort } from "../ReactivePorts/Separator";

export interface ReactiveEditor {
	accordionItem?: ReactiveAccordionItemPort;
	codeBlock?: ReactiveCodeBlockPort;
	emptyMedia?: ReactiveEmptyMediaPort;
	formatting?: ReactiveFormattingPort;
	image?: ReactiveImagePort;
	readOnly?: ReactiveReadOnlyPort;
	separator?: ReactiveSeparatorPort;
}

export interface CreateReactiveEditorParams {
	editor: RangeXEditor;
}

export interface CreateReactiveEditorResult {
	reactiveEditor: ReactiveEditor;
	disposeList: Set<() => void>;
}
