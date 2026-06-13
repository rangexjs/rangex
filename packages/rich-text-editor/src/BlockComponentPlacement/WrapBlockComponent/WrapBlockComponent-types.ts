import type {
	BlockNestedContextLine,
	ContentFlowNode,
	EditorAPI,
	List,
	NestedEditable,
} from "rich-text-area";

export interface WrapBlockComponentParams {
	editorAPI: EditorAPI;
	fromNode: ContentFlowNode;
	fromOffset: number;
	toNode: ContentFlowNode;
	toOffset: number;
	blockNestedContextLine: BlockNestedContextLine;
	target: NestedEditable | List;
}
