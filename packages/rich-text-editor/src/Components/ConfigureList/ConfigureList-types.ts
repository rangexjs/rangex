import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type {
	BlockNestedContextLine,
	EditorAPI,
	ListLineType,
} from "rich-text-area";
import type { BlockComponentPlacement } from "../../BlockComponentPlacement";

export type ListLocalName = "ol" | "ul";

export interface CreateListLineParams {
	localName: ListLocalName;
	lineType: ListLineType;
}

export interface CreateListLineResult extends BlockNestedContextLine {}

export interface ConfigureListParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
