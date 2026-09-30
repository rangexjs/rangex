import type { ListLocalName } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveListPort {
	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;
	localName: Accessor<ListLocalName | null>;
	currentComponent: Accessor<HTMLElement | null>;
	isSelectionActive: Accessor<boolean>;
}
