import type { ToolbarButtons } from "../CommonTypes";
import type { DefaultStyleValues } from "../ToolbarButtonDefaultValues";
import type {
	CodeBlockLanguage,
	FontFamilyOption,
} from "../ToolbarButtonProps";

export interface RichTextEditorUIOptions {
	codeBlockLanguages?: CodeBlockLanguage[];
	fontFamilyOptions?: FontFamilyOption[];
}

export interface RichTextEditorUIConstructorParams {
	richTextArea: HTMLElement;
	toolbarButtons: ToolbarButtons;
	defaultStyleValues?: Partial<DefaultStyleValues>;
	options?: RichTextEditorUIOptions;
}
