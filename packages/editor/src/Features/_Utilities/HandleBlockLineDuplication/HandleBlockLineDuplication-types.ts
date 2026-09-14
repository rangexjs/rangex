import type { EditorAPI, Line } from "rich-text-area";
import type { DuplicateConfigPort } from "#adapters";

export interface HandleBlockLineDuplicationParams {
	port: DuplicateConfigPort;
	editorAPI: EditorAPI;
	getBlockLine: () => Line | null;
}

export type HandleBlockLineDuplicationResult = () => void;
