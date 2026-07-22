import type {
	CodeBlockLanguage,
	CodeBlockTheme,
	OverlayHost,
	ToolbarButtons,
	UIExtension,
} from "#ports";
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
	extensions: UIExtension[];
	overlayHost: OverlayHost;
	options?: RichTextEditorUIOptions;
}
