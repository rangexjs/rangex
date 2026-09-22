import type { Accessor } from "solid-js";

export interface ReactiveListPort {
	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;
	isActive: Accessor<boolean>;
}
