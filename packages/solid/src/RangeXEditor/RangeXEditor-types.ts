import type { ReactiveCodeBlockPort } from "../ReactivePorts/CodeBlock";

export interface SolidEditor {
	codeBlock?: ReactiveCodeBlockPort;

	destroy(): void;
}

export interface CreateEditorResult {
	editor: SolidEditor;
	host: HTMLElement;
	floatingContainer: HTMLDivElement;
}
