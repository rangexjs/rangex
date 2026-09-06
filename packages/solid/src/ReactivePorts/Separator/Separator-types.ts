import type { Accessor } from "solid-js";

export interface ReactiveSeparatorPort {
	canInsert: Accessor<boolean>;

	insert(): void;
}

export interface ReactiveSeparatorResult {
	port: ReactiveSeparatorPort;
	dispose: () => void;
}
