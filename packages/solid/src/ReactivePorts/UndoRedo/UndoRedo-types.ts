import type { Accessor } from "solid-js";

export interface ReactiveUndoRedoPort {
	canStepBack: Accessor<boolean>;
	canStepForward: Accessor<boolean>;

	stepBack(): void;
	stepForward(): void;
}

export interface ReactiveUndoRedoResult {
	port: ReactiveUndoRedoPort;
	dispose: () => void;
}
