import type { VideoEditorPort } from "#adapters";
import type { OverlayAppearanceHandler } from "../../../OverlayAppearanceHandler";

export interface HandleVideoPopoverAppearanceParams {
	editorPort: VideoEditorPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
}
