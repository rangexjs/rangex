import type { BlockComponent } from "rich-text-area";
import type { ImageEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { ImageInternals } from "../ConfigureImage-types";

export interface HandleImageSwapCardOverlayToggleParams {
	editorPort: ImageEditorPort;
	getCurrentBlock: () => BlockComponent | null;
	internals: ImageInternals;
	swapAnchorController: AnchoredOverlayController;
}
