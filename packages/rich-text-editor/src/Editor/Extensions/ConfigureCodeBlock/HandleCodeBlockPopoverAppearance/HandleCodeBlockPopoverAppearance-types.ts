import type { CodeBlockEditorPort } from "#adapters";
import type { OverlayAppearanceHandler } from "../../../OverlayAppearanceHandler";

export interface HandleCodeBlockPopoverAppearanceParams {
	editorPort: CodeBlockEditorPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
}
