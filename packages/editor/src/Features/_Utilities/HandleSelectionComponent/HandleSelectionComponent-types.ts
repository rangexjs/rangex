import type { Component, EditorAPI } from "rich-text-area";
import type { CurrentComponentConfigPort } from "#adapters";
import type { ComponentName } from "#engine-links";

export interface HandleSelectionComponentParams {
	port: CurrentComponentConfigPort<Component>;
	editorAPI: EditorAPI;
	componentName: ComponentName;
}
