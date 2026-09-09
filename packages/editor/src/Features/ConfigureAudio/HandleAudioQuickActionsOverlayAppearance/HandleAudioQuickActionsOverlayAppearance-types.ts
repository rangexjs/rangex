import type { AudioConfigPort } from "#adapters/Audio";
import type {
	AnchoredOverlayController,
	OverlayAppearanceHandler,
} from "#engine-links";

export interface HandleAudioQuickActionsOverlayAppearanceParams {
	configPort: AudioConfigPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
	anchorController: AnchoredOverlayController;
}
