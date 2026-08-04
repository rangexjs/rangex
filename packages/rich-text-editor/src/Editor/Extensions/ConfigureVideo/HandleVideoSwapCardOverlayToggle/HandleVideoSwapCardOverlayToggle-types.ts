import type { BlockComponent } from "rich-text-area";
import type { VideoEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { VideoInternals } from "../ConfigureVideo-types";

export interface HandleVideoSwapCardOverlayToggleParams {
	editorPort: VideoEditorPort;
	getCurrentBlock: () => BlockComponent | null;
	internals: VideoInternals;
	swapAnchorController: AnchoredOverlayController;
}
