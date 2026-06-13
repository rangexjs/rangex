import type { ToolbarButtons } from "../CommonTypes";
import type { DefaultStyleValues } from "../ToolbarButtonDefaultValues";

export interface RichTextEditorUIConstructorParams {
	richTextArea: HTMLElement;
	toolbarButtons: ToolbarButtons;
	defaultStyleValues?: Partial<DefaultStyleValues>;
}
