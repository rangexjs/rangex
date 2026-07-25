import type {
	BlockNestedContext,
	EditorAPI,
	List,
	RootEditable,
} from "rich-text-area";
import type {
	BundledLangKeys,
	BundledThemeKeys,
	ThemedCodeLines,
} from "../../../Libs";
import type { CSSHighlightManager } from "./CSSHighlightManager";

export interface OnCodeChangeParams {
	blockNestedContext: BlockNestedContext;
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
	blockNestedContext: BlockNestedContext;
}

export interface CodeHighlighterConstructorParams {
	editorAPI: EditorAPI;
}

export interface CodeHighlighterUpdateParams {
	blockNestedContext: BlockNestedContext;
	lang: BundledLangKeys;
	theme: { light: BundledThemeKeys; dark: BundledThemeKeys };
}
