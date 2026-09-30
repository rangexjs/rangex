import type { Accessor } from "solid-js";

export interface ReactiveTodoListPort {
	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;
	currentComponent: Accessor<HTMLElement | null>;
	isSelectionActive: Accessor<boolean>;
}
