import type { ImageConfigPort } from "#adapters/Image";
import type {
	AnchoredOverlayController,
	OverlayAppearanceHandler,
} from "#engine-links";

export interface HandleImageQuickActionsOverlayAppearanceParams {
	configPort: ImageConfigPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
	anchorController: AnchoredOverlayController;
}
