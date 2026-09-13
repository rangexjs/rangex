import type { UndoRedoPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveUndoRedoPort } from "./UndoRedo-types";

export const UndoRedo = <T extends UndoRedoPublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
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

		stepBack: publicPort.stepBack,
		stepForward: publicPort.stepForward,
	};

	return port as FromPublicToReactivePort<T>;
};
