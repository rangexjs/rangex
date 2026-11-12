import type { Component, EditorAPI } from "@rangex/core";

import type { UnwrapConfigPort } from "#adapters";

export interface HandleComponentUnwrapParams {
	port: UnwrapConfigPort;
	editorAPI: EditorAPI;
	getComponent: () => Component | null;
}
