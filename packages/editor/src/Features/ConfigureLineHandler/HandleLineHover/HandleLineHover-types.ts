import type { EditorAPI, Line } from "@rangex/core";

import type { LineHandlerConfigPort } from "#adapters/LineHandler";

export interface CollectShadowRootsParams {
	editorAPI: EditorAPI;
}

export type CollectShadowRootsResult = ShadowRoot[];

export interface FindLineAtPointParams {
	editorAPI: EditorAPI;
	clientX: number;
	clientY: number;
}

export type FindLineAtPointResult = Line | null;

export interface IsPointInsideElementParams {
	editorAPI: EditorAPI;
	element: Element;
	clientX: number;
	clientY: number;
}

export type IsPointInsideElementResult = boolean;

export type GetCurrentLineFn = () => Line | null;

export type OnLineChangeFn = (line: Line | null) => void;

export interface HandleLineHoverParams {
	configPort: LineHandlerConfigPort;
	editorAPI: EditorAPI;
	onLineChange: OnLineChangeFn;
}

export interface HandleLineHoverResult {
	getCurrentLine: GetCurrentLineFn;
	cleanup(): void;
}
