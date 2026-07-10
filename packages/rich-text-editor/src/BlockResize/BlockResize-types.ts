import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { ComponentName } from "../Constants";

export interface BlockResizeInternals {
	currentBlock: BlockNestedContext | null;
	resizableComponentNames: Set<ComponentName>;
}

export interface RegisterComponentParams {
	componentName: ComponentName;
}

export interface UnregisterComponentParams {
	componentName: ComponentName;
}

export interface BlockResize {
	registerComponent: (params: RegisterComponentParams) => void;
	unregisterComponent: (params: UnregisterComponentParams) => void;
	cleanup: () => void;
}

export interface CreateBlockResizeParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}

export interface CreateBlockResizeResult extends BlockResize {}
