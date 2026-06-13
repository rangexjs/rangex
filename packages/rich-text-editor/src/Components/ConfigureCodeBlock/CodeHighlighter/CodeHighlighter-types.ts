import type {
	BlockNestedContext,
	EditorAPI,
	NestedEditable,
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
	nestedEditable: NestedEditable;
}

export type GetCodeLinesResult = string[];

export interface ApplyTokenColorsParams {
	editorAPI: EditorAPI;
	nestedEditable: NestedEditable;
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
