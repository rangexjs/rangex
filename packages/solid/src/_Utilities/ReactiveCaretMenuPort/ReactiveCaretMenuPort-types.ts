import type { Accessor } from "solid-js";

export interface ReactiveCaretMenuPort {
	readonly element: HTMLDivElement;

	isOpen: Accessor<boolean>;
}
