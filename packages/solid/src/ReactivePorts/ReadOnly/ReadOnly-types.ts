import type { Accessor } from "solid-js";

export interface ReactiveReadOnlyPort {
	checked: Accessor<boolean>;

	toggle(): void;
}
