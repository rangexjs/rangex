import type { EditorAPI, Line } from "@rangex/core";
import type { DuplicateConfigPort } from "#adapters";

export interface HandleBlockLineDuplicationParams {
	port: DuplicateConfigPort;
	editorAPI: EditorAPI;
	getBlockLine: () => Line | null;
}

export type HandleBlockLineDuplicationResult = () => void;
