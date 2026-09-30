import type {
	BlockComponentLine,
	BlockContentLineLocalName,
	EditorAPI,
	ListLocalName,
} from "@rangex/core";
import type { MarkdownConfigPort } from "#adapters/Markdown";
import type { BlockComponentPlacement } from "#engine-links";
import type { CodeBlockTheme } from "#storage";

export type HeadingLocalName = Exclude<BlockContentLineLocalName, "p">;

export interface HeadingConversion {
	type: "heading";
	localName: HeadingLocalName;
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
	language: string | null;
	theme: CodeBlockTheme | null;
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

export interface MatchBlockTriggerParams {
	configPort: MarkdownConfigPort;
	prefix: string;
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
	language: string | null;
	theme: CodeBlockTheme | null;
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
	configPort: MarkdownConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
