import type { CodeBlockLanguage, CodeBlockTheme } from "#ports";
import type { ToolbarButtons } from "../CommonTypes";
import type { DefaultStyleValues } from "../ToolbarButtonDefaultValues";
import type {
	CustomComponentName,
	FontFamilyOption,
} from "../ToolbarButtonProps";

export interface RichTextEditorUIOptions {
	codeBlockLanguages?: CodeBlockLanguage[];
	codeBlockThemes?: CodeBlockTheme[];
	customComponentNames?: CustomComponentName[];
	fontFamilyOptions?: FontFamilyOption[];
}

export interface RichTextEditorUIConstructorParams {
	richTextArea: HTMLElement;
	toolbarButtons: ToolbarButtons;
	defaultStyleValues?: Partial<DefaultStyleValues>;
	options?: RichTextEditorUIOptions;
}
