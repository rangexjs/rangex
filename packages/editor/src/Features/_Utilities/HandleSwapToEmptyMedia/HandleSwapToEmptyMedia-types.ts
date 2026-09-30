import type { BlockComponent, EditorAPI } from "rich-text-area";
import type {
	CurrentComponentConfigPort,
	SwapToEmptyMediaConfigPort,
} from "#adapters";

export interface HandleSwapToEmptyMediaParams {
	port: SwapToEmptyMediaConfigPort & CurrentComponentConfigPort<BlockComponent>;
	editorAPI: EditorAPI;
}
