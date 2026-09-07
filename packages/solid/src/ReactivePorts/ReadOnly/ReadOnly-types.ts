import type { ReadOnlyPublicPort } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveReadOnlyPort {
	readonly raw: ReadOnlyPublicPort;

	checked: Accessor<boolean>;

	toggle(): void;
}

export interface ReactiveReadOnlyResult {
	port: ReactiveReadOnlyPort;
	dispose: () => void;
}
