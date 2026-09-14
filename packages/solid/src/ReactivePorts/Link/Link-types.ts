import type { Accessor } from "solid-js";

export interface ReactiveLinkPort {
	canInsert: Accessor<boolean>;
	currentComponent: Accessor<HTMLElement | null>;
}
