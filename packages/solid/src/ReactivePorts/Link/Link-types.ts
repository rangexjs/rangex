import type { LinkAttrs } from "@rangex/editor/link";
import type { Accessor } from "solid-js";

export interface ReactiveLinkPort {
	canInsert: Accessor<boolean>;
	domAttrs: Accessor<LinkAttrs | null>;
	currentComponent: Accessor<HTMLElement | null>;
	isSelectionActive: Accessor<boolean>;
}
