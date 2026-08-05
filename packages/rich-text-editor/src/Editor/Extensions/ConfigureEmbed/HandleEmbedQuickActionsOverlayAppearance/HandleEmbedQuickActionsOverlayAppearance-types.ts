import type { EmbedEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { OverlayAppearanceHandler } from "../../../OverlayAppearanceHandler";

export interface HandleEmbedQuickActionsOverlayAppearanceParams {
	editorPort: EmbedEditorPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
	anchorController: AnchoredOverlayController;
	swapAnchorController: AnchoredOverlayController;
}
