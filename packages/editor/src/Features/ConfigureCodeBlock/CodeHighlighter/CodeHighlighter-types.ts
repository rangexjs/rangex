import type {
	BlockComponent,
	EditorAPI,
	List,
	RootEditable,
} from "@rangex/core";
import type { GetHighlightInfoFn, ThemedCodeLines } from "#adapters/CodeBlock";
import type { CodeBlockAttrValidators } from "#dom-attrs";
import type { CodeBlockTheme } from "#storage";
import type { CSSHighlightManager } from "./CSSHighlightManager";

export interface OnCodeChangeParams {
	blockComponent: BlockComponent;
}

export type OnCodeChangeFn = (params: OnCodeChangeParams) => void;

export interface OnCodeBlockRemoveParams {
	blockComponent: BlockComponent;
}

export type OnCodeBlockRemoveFn = (params: OnCodeBlockRemoveParams) => void;

export interface WatchCodeBlocksParams {
	rootEditable: RootEditable;
	onCodeChange: OnCodeChangeFn;
	onCodeBlockRemove: OnCodeBlockRemoveFn;
}

export interface GetCodeBlockListParams {
	blockComponent: BlockComponent;
}

export interface GetCodeLinesParams {
	editorAPI: EditorAPI;
	list: List;
}

export type GetCodeLinesResult = string[];

export interface ClearCodeBlockColorsParams {
	blockComponent: BlockComponent;
	cssHighlightManager: CSSHighlightManager;
	list: List;
}

export interface WriteCodeBlockColorsParams {
	blockComponent: BlockComponent;
	attrValidators: CodeBlockAttrValidators;
	backgrounds: CodeBlockTheme;
	foregrounds: CodeBlockTheme;
}

export interface ApplyTokenColorsParams {
	editorAPI: EditorAPI;
	list: List;
	cssHighlightManager: CSSHighlightManager;
	codeLines: ThemedCodeLines;
}

export interface UpdateCodeBlockColorsParams {
	editorAPI: EditorAPI;
	getHighlightInfo: GetHighlightInfoFn | null;
	attrValidators: CodeBlockAttrValidators;
	cssHighlightManager: CSSHighlightManager;
	blockComponent: BlockComponent;
}

export interface CodeBlockHighlight {
	language: string | null;
	theme: CodeBlockTheme | null;
}

export interface IsSameHighlightParams {
	source: CodeBlockHighlight;
	target: CodeBlockHighlight;
}

export interface GetOutdatedCodeBlocksParams {
	rootEditable: RootEditable;
	appliedHighlights: WeakMap<BlockComponent, CodeBlockHighlight>;
}

export interface CodeHighlighterConstructorParams {
	editorAPI: EditorAPI;
	getHighlightInfo: GetHighlightInfoFn | null;
	attrValidators: CodeBlockAttrValidators;
}

export interface CodeHighlighterUpdateParams {
	blockComponent: BlockComponent;
	language: string | null;
	theme: CodeBlockTheme | null;
}
