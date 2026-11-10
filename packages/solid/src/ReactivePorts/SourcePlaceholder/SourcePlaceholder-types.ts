import type { Accessor } from "solid-js";

export interface ReactiveSourcePlaceholderPort {
	canInsert: Accessor<boolean>;
}
