import type { BlockComponentLine, Line } from "rich-text-area";

export interface CreateTodoListParams {
	childNodes?: Line[];
}

export type CreateTodoListResult = BlockComponentLine;
