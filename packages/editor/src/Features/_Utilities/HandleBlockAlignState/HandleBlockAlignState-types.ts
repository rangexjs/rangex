import type { BlockComponent, EditorAPI } from "rich-text-area";
import type {
	BlockAlignConfigPort,
	CurrentComponentConfigPort,
} from "#adapters";

export interface HandleBlockAlignStateParams {
	port: BlockAlignConfigPort & CurrentComponentConfigPort<BlockComponent>;
	editorAPI: EditorAPI;
}
