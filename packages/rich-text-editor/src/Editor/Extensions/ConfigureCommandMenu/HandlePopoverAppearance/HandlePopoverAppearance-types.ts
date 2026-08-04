import type { EditorAPI } from "rich-text-area";
import type { CommandMenuEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";

export interface HandlePopoverAppearanceParams {
	editorPort: CommandMenuEditorPort;
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}
