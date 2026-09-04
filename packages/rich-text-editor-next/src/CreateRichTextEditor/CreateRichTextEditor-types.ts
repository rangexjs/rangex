import type { CreateEditorParams } from "@rangex/editor";

export interface RichTextEditor {
	readonly editorHost: HTMLDivElement;
	destroy(): void;
}

export interface CreateRichTextEditorParams extends CreateEditorParams {}

export interface CreateRichTextEditorResult extends RichTextEditor {}
