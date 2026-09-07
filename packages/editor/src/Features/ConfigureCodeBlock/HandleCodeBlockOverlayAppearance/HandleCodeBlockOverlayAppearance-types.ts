import type { CodeBlockConfigPort } from "#adapters/CodeBlock";
import type {
	AnchoredOverlayController,
	OverlayAppearanceHandler,
} from "#engine-links";

export interface HandleCodeBlockOverlayAppearanceParams {
	configPort: CodeBlockConfigPort;
	overlayAppearanceHandler: OverlayAppearanceHandler;
	anchorController: AnchoredOverlayController;
}
