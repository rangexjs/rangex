import type { EmbedEditorPort } from "#adapters";
import type { OverlayAppearanceHandler } from "../../../OverlayAppearanceHandler";

export interface HandleEmbedPopoverAppearanceParams {
	editorPort: EmbedEditorPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
}
