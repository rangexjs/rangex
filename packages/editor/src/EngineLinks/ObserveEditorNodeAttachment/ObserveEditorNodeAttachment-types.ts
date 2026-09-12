import type { EditorAPI, EditorNode } from "rich-text-area";

interface OnMutationCallbackParams {
	attachedNodes: EditorNode[];
	detachedNodes: EditorNode[];
}

export type OnMutationCallbackFn = (params: OnMutationCallbackParams) => void;

export interface ObserveEditorNodeAttachmentParams {
	editorAPI: EditorAPI;
	onMutation: OnMutationCallbackFn;
}

export type ObserveEditorNodeAttachmentResult = () => void;
