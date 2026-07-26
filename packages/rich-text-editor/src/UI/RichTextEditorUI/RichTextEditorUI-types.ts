import type { OverlayHost, ToolbarButtons, UIExtension } from "#ports";
import type { UIPortsContextValue } from "../Components/App";
import type { CustomComponentName } from "../ToolbarButtonProps";

export interface RichTextEditorUIOptions {
	customComponentNames?: CustomComponentName[];
}

export interface RichTextEditorUIConstructorParams {
	richTextArea: HTMLElement;
	toolbarButtons: ToolbarButtons;
	extensions: UIExtension[];
	uiPorts: UIPortsContextValue;
	overlayHost: OverlayHost;
	options?: RichTextEditorUIOptions;
}
