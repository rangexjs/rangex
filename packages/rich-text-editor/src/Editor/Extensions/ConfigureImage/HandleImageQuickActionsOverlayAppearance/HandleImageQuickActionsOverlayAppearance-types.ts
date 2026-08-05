import type { ImageEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { OverlayAppearanceHandler } from "../../../OverlayAppearanceHandler";

export interface HandleImageQuickActionsOverlayAppearanceParams {
	editorPort: ImageEditorPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
	anchorController: AnchoredOverlayController;
	swapAnchorController: AnchoredOverlayController;
}
