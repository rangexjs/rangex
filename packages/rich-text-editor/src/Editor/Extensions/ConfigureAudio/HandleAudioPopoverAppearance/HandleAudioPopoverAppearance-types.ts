import type { AudioEditorPort } from "#adapters";
import type { OverlayAppearanceHandler } from "../../../OverlayAppearanceHandler";

export interface HandleAudioPopoverAppearanceParams {
	editorPort: AudioEditorPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
}
