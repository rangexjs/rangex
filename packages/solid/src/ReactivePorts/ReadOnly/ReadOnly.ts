import type { ReadOnlyPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type {
	ReactiveReadOnlyPort,
	ReactiveReadOnlyResult,
} from "./ReadOnly-types";

export const ReadOnly = (
	publicPort: ReadOnlyPublicPort,
): ReactiveReadOnlyResult => {
	const [checked, setChecked] = createSignal(publicPort.checked);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onCheckedUpdate(setChecked));

	const port: ReactiveReadOnlyPort = {
		checked,

		toggle: publicPort.toggle,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
