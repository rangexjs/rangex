import type { BlockComponent } from "rich-text-area";
import type { EmbedEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { EmbedInternals } from "../ConfigureEmbed-types";

export interface HandleEmbedSwapCardOverlayToggleParams {
	editorPort: EmbedEditorPort;
	getCurrentBlock: () => BlockComponent | null;
	internals: EmbedInternals;
	swapAnchorController: AnchoredOverlayController;
}
