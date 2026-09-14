import type { ReadOnlyPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveReadOnlyPort } from "./ReadOnly-types";

export const ReadOnly = <T extends ReadOnlyPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveReadOnlyPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveReadOnlyPort>;
	}

	const [checked, setChecked] = createSignal(publicPort.checked);

	onCleanup(publicPort.onCheckedUpdate(setChecked));

	const port: ReactiveReadOnlyPort = {
		checked,

		toggle: publicPort.toggle,
	};

	return port as PreserveUndefined<T, ReactiveReadOnlyPort>;
};
