import type { BlockNestedContextLine, Line } from "rich-text-area";

export interface CreateTodoListParams {
	childNodes?: Line[];
}

export type CreateTodoListResult = BlockNestedContextLine;
