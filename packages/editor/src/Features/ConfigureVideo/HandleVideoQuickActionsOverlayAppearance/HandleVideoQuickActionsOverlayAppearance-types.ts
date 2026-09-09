import type { VideoConfigPort } from "#adapters/Video";
import type {
	AnchoredOverlayController,
	OverlayAppearanceHandler,
} from "#engine-links";

export interface HandleVideoQuickActionsOverlayAppearanceParams {
	configPort: VideoConfigPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
	anchorController: AnchoredOverlayController;
}
