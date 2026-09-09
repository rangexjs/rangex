import type { EmbedConfigPort } from "#adapters/Embed";
import type {
	AnchoredOverlayController,
	OverlayAppearanceHandler,
} from "#engine-links";

export interface HandleEmbedQuickActionsOverlayAppearanceParams {
	configPort: EmbedConfigPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
	anchorController: AnchoredOverlayController;
}
