import type { TurnIntoAvailability } from "@rangex/editor/line-handler";
import type { Accessor } from "solid-js";

export interface ReactiveLineHandlerPort {
	turnIntoAvailability: Accessor<TurnIntoAvailability>;
	canRemove: Accessor<boolean>;
	canDuplicate: Accessor<boolean>;
	canUnwrap: Accessor<boolean>;
}
