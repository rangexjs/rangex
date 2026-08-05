import type { EditorAPI } from "rich-text-area";
import type { EmbedEditorPort, EmbedEmitSwapParams } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";
import type { EmbedInternals } from "../ConfigureEmbed-types";

export interface HandleEmbedSwapParams {
	editorPort: EmbedEditorPort;
	editorAPI: EditorAPI;
	internals: EmbedInternals;
	swapAnchorController: AnchoredOverlayController;
}

export interface ResolveSwapSrcParams {
	embedEmitSwapParams: EmbedEmitSwapParams;
	editorPort: EmbedEditorPort;
}

export type ResolveSwapSrcResult = string | null;
