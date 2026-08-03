import type {
	BlockComponent,
	EditorAPI,
	List,
	RootEditable,
} from "rich-text-area";
import type { BundledLangKeys, BundledThemeKeys, ThemedCodeLines } from "#libs";
import type { CSSHighlightManager } from "./CSSHighlightManager";

export interface OnCodeChangeParams {
	blockComponent: BlockComponent;
}

export type OnCodeChangeFn = (params: OnCodeChangeParams) => void;

export interface WatchCodeBlocksParams {
	rootEditable: RootEditable;
	onCodeChange: OnCodeChangeFn;
}

export interface GetCodeLinesParams {
	editorAPI: EditorAPI;
	list: List;
}

export type GetCodeLinesResult = string[];

export interface ApplyTokenColorsParams {
	editorAPI: EditorAPI;
	list: List;
	cssHighlightManager: CSSHighlightManager;
	codeLines: ThemedCodeLines;
	theme: { light: BundledThemeKeys; dark: BundledThemeKeys };
}

export interface UpdateCodeBlockColorsParams {
	editorAPI: EditorAPI;
	cssHighlightManager: CSSHighlightManager;
	blockComponent: BlockComponent;
}

export interface CodeHighlighterConstructorParams {
	editorAPI: EditorAPI;
}

export interface CodeHighlighterUpdateParams {
	blockComponent: BlockComponent;
	lang: BundledLangKeys;
	theme: { light: BundledThemeKeys; dark: BundledThemeKeys };
}
