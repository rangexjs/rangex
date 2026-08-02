import type { BlockNestedContextLine, Line } from "rich-text-area";
import type { CodeBlockLanguage } from "#adapters";

export interface CreateCodeBlockParams {
	language: CodeBlockLanguage;
	childNodes?: Line[];
}

export interface CreateCodeBlockResult extends BlockNestedContextLine {}
