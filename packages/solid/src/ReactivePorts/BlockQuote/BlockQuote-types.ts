import type { Accessor } from "solid-js";

export interface ReactiveBlockQuotePort {
	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;
	isActive: Accessor<boolean>;
}
