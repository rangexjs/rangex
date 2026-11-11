import type { Component, EditorAPI } from "@rangex/core";
import type { CurrentComponentConfigPort } from "#adapters";
import type { ComponentName } from "#constants";

export interface HandleSelectionComponentParams {
	port: CurrentComponentConfigPort<Component>;
	editorAPI: EditorAPI;
	componentName: ComponentName;
}
