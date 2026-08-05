export interface ResolveTodoListParams {
	todoListEl: HTMLElement;
	customStorage: unknown;
}

export type ResolveTodoListResult = Promise<void>;
