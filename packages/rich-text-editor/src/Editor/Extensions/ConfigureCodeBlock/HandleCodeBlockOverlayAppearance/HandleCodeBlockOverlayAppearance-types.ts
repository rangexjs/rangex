import type { CodeBlockEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { OverlayAppearanceHandler } from "../../../OverlayAppearanceHandler";

export interface HandleCodeBlockOverlayAppearanceParams {
	editorPort: CodeBlockEditorPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
	anchorController: AnchoredOverlayController;
}
