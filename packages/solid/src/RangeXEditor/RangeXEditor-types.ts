import type { ReactiveAccordionItemPort } from "../ReactivePorts/AccordionItem";
import type { ReactiveCodeBlockPort } from "../ReactivePorts/CodeBlock";
import type { ReactiveEmptyMediaPort } from "../ReactivePorts/EmptyMedia";
import type { ReactiveFormattingPort } from "../ReactivePorts/Formatting";
import type { ReactiveImagePort } from "../ReactivePorts/Image";
import type { ReactiveReadOnlyPort } from "../ReactivePorts/ReadOnly";
import type { ReactiveSeparatorPort } from "../ReactivePorts/Separator";

export interface SolidEditor {
	accordionItem?: ReactiveAccordionItemPort;
	codeBlock?: ReactiveCodeBlockPort;
	emptyMedia?: ReactiveEmptyMediaPort;
	formatting?: ReactiveFormattingPort;
	image?: ReactiveImagePort;
	readOnly?: ReactiveReadOnlyPort;
	separator?: ReactiveSeparatorPort;

	destroy(): void;
}

export interface CreateEditorResult {
	editor: SolidEditor;
	host: HTMLElement;
	floatingContainer: HTMLDivElement;
	hostStyles: string;
}
