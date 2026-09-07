import type { SeparatorPublicPort } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveSeparatorPort {
	readonly raw: SeparatorPublicPort;

	canInsert: Accessor<boolean>;

	insert(): void;
}

export interface ReactiveSeparatorResult {
	port: ReactiveSeparatorPort;
	dispose: () => void;
}
