import type { UndoRedoPublicPort } from "@rangex/editor/undo-redo";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveUndoRedoPort } from "./UndoRedo-types";

export const UndoRedo = <T extends UndoRedoPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveUndoRedoPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveUndoRedoPort>;
	}

	const [canStepBack, setCanStepBack] = createSignal(publicPort.canStepBack);
	const [canStepForward, setCanStepForward] = createSignal(
		publicPort.canStepForward,
	);

	onCleanup(publicPort.onCanStepBackUpdate(setCanStepBack));
	onCleanup(publicPort.onCanStepForwardUpdate(setCanStepForward));

	const port: ReactiveUndoRedoPort = {
		canStepBack,
		canStepForward,
	};

	return port as PreserveUndefined<T, ReactiveUndoRedoPort>;
};
