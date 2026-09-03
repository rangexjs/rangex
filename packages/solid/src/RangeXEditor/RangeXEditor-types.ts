import type { ReactiveAccordionItemPort } from "../ReactivePorts/AccordionItem";
import type { ReactiveCodeBlockPort } from "../ReactivePorts/CodeBlock";
import type { ReactiveEmptyMediaPort } from "../ReactivePorts/EmptyMedia";
import type { ReactiveFormattingPort } from "../ReactivePorts/Formatting";
import type { ReactiveImagePort } from "../ReactivePorts/Image";

export interface SolidEditor {
	accordionItem?: ReactiveAccordionItemPort;
	codeBlock?: ReactiveCodeBlockPort;
	emptyMedia?: ReactiveEmptyMediaPort;
	formatting?: ReactiveFormattingPort;
	image?: ReactiveImagePort;

	destroy(): void;
}

export interface CreateEditorResult {
	editor: SolidEditor;
	host: HTMLElement;
	floatingContainer: HTMLDivElement;
}
