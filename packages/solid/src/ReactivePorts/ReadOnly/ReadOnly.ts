import type { ReadOnlyPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveReadOnlyPort } from "./ReadOnly-types";

export const ReadOnly = <T extends ReadOnlyPublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
	}

	const [checked, setChecked] = createSignal(publicPort.checked);

	onCleanup(publicPort.onCheckedUpdate(setChecked));

	const port: ReactiveReadOnlyPort = {
		checked,

		toggle: publicPort.toggle,
	};

	return port as FromPublicToReactivePort<T>;
};
