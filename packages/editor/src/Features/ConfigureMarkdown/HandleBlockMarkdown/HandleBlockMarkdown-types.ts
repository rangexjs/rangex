import type {
	BlockComponentLine,
	BlockContentLineLocalName,
	EditorAPI,
	ListLocalName,
} from "rich-text-area";
import type { CodeBlockLanguage } from "#adapters/CodeBlock";
import type { BlockComponentPlacement } from "#engine-links";

export interface HeadingConversion {
	type: "localName";
	localName: BlockContentLineLocalName;
}

export interface ListConversion {
	type: "list";
	localName: ListLocalName;
}

export interface TodoListConversion {
	type: "todoList";
}

export interface BlockQuoteConversion {
	type: "blockQuote";
}

export interface CodeBlockConversion {
	type: "codeBlock";
	language: CodeBlockLanguage;
}

export type BlockMarkdownConversion =
	| HeadingConversion
	| ListConversion
	| TodoListConversion
	| BlockQuoteConversion
	| CodeBlockConversion;

export interface CanApplyBlockMarkdownConversionParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	conversion: BlockMarkdownConversion;
}

export type MatchBlockTriggerResult = BlockMarkdownConversion | null;

export interface WrapListShapedParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	blockComponentLine: BlockComponentLine;
}

export interface ConvertToListParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	localName: ListLocalName;
}

export interface ConvertToTodoListParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}

export interface ConvertToCodeBlockParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	language: CodeBlockLanguage;
}

export interface ConvertToBlockQuoteParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}

export interface ApplyBlockMarkdownConversionParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	conversion: BlockMarkdownConversion;
}

export interface HandleBlockMarkdownParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
