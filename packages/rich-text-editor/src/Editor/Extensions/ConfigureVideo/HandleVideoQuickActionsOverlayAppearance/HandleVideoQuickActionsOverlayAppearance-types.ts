import type { VideoEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { OverlayAppearanceHandler } from "../../../OverlayAppearanceHandler";

export interface HandleVideoQuickActionsOverlayAppearanceParams {
	editorPort: VideoEditorPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
	anchorController: AnchoredOverlayController;
	swapAnchorController: AnchoredOverlayController;
}
