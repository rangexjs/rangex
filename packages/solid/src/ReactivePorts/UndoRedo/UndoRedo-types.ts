import type { Accessor } from "solid-js";

export interface ReactiveUndoRedoPort {
	canStepBack: Accessor<boolean>;
	canStepForward: Accessor<boolean>;
}
