import type { EditorAPI } from "rich-text-area";
import type { EmojiEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";

export interface HandlePopoverAppearanceParams {
	editorPort: EmojiEditorPort;
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}
