import type { Accessor } from "solid-js";

export interface ReactiveTodoListPort {
	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;

	insert(): void;
	wrap(): void;
}

export interface ReactiveTodoListResult {
	port: ReactiveTodoListPort;
	dispose: () => void;
}
