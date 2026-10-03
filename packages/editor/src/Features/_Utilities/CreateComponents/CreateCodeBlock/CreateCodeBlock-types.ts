import type { BlockComponentLine, Line } from "@rangex/core";
import type { CodeBlockTheme } from "#storage";

export interface CreateCodeBlockParams {
	language: string | null;
	theme: CodeBlockTheme | null;
	childNodes?: Line[];
}

export interface CreateCodeBlockResult extends BlockComponentLine {}
