import type { AudioEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { OverlayAppearanceHandler } from "../../../OverlayAppearanceHandler";

export interface HandleAudioQuickActionsOverlayAppearanceParams {
	editorPort: AudioEditorPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
	anchorController: AnchoredOverlayController;
	swapAnchorController: AnchoredOverlayController;
}
