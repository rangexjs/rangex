import type { EditorAPI, Line } from "rich-text-area";
import type { DuplicatePort } from "#adapters";

export interface HandleBlockLineDuplicationParams {
	port: DuplicatePort;
	editorAPI: EditorAPI;
	getBlockLine: () => Line | null;
}

export type HandleBlockLineDuplicationResult = () => void;
