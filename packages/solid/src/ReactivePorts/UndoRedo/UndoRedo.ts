import type { UndoRedoPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type {
	ReactiveUndoRedoPort,
	ReactiveUndoRedoResult,
} from "./UndoRedo-types";

export const UndoRedo = (
	publicPort: UndoRedoPublicPort,
): ReactiveUndoRedoResult => {
	const [canStepBack, setCanStepBack] = createSignal(publicPort.canStepBack);
	const [canStepForward, setCanStepForward] = createSignal(
		publicPort.canStepForward,
	);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onCanStepBackUpdate(setCanStepBack));
	unsubscribeList.add(publicPort.onCanStepForwardUpdate(setCanStepForward));

	const port: ReactiveUndoRedoPort = {
		canStepBack,
		canStepForward,

		stepBack: publicPort.stepBack,
		stepForward: publicPort.stepForward,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
