import type { Component, EditorAPI } from "rich-text-area";
import type { UnwrapPort } from "#adapters";

export interface HandleComponentUnwrapParams {
	port: UnwrapPort;
	editorAPI: EditorAPI;
	getComponent: () => Component | null;
}
