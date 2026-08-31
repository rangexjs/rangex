import type {
	BlockComponentLine,
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
	blockComponentLine: BlockComponentLine;
	target: NestedEditable | List;
}
