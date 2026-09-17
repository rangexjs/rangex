import type { BlockComponentLine, Line } from "rich-text-area";
import type { CodeBlockTheme } from "#engine-links";

export interface CreateCodeBlockParams {
	language: string | null;
	theme: CodeBlockTheme | null;
	childNodes?: Line[];
}

export interface CreateCodeBlockResult extends BlockComponentLine {}
