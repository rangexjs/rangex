import type {
	CodeBlockLanguage,
	CodeBlockTheme,
	ResolvedExtension,
	ToolbarButtons,
} from "#ports";
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
	extensions: ResolvedExtension[];
	defaultStyleValues?: Partial<DefaultStyleValues>;
	options?: RichTextEditorUIOptions;
}
