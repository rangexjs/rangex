import type { Accessor } from "solid-js";

export interface ReactiveQuickActionsPort {
	readonly element: HTMLDivElement;

	isOpen: Accessor<boolean>;
}
