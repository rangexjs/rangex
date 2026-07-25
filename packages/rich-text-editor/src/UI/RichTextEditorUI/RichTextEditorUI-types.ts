import type { OverlayHost, ToolbarButtons, UIExtension } from "#ports";
import type { CustomComponentName } from "../ToolbarButtonProps";

export interface RichTextEditorUIOptions {
	customComponentNames?: CustomComponentName[];
}

export interface RichTextEditorUIConstructorParams {
	richTextArea: HTMLElement;
	toolbarButtons: ToolbarButtons;
	extensions: UIExtension[];
	overlayHost: OverlayHost;
	options?: RichTextEditorUIOptions;
}
