import type { EditorAPI } from "rich-text-area";
import type { MentionEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";

export interface HandlePopoverAppearanceParams {
	editorPort: MentionEditorPort;
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}
