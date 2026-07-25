import type { ImageEditorPort } from "#adapters";
import type { OverlayAppearanceHandler } from "../../../OverlayAppearanceHandler";

export interface HandleImagePopoverAppearanceParams {
	editorPort: ImageEditorPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
}
