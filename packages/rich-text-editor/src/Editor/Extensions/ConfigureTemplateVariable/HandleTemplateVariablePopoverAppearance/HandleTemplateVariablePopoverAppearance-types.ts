import type { EditorAPI } from "rich-text-area";
import type { TemplateVariableEditorPort } from "#adapters";
import type { AnchoredOverlayController } from "../../../_Utilities";

export interface HandleTemplateVariablePopoverAppearanceParams {
	editorPort: TemplateVariableEditorPort;
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}
