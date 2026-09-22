import type { Component, EditorAPI } from "rich-text-area";
import type { UnwrapConfigPort } from "#adapters";

export interface HandleComponentUnwrapParams {
	port: UnwrapConfigPort;
	editorAPI: EditorAPI;
	getComponent: () => Component | null;
}
