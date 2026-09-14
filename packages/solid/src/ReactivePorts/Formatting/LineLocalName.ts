import type { FormattingPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromFormattingToReactivePort,
	ReactiveLineLocalNamePort,
} from "./_Utilities";

export const LineLocalName = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveLineLocalNamePort> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<
			T,
			ReactiveLineLocalNamePort
		>;
	}

	const [state, setState] = createSignal(formatting.lineLocalName);

	onCleanup(formatting.onLineLocalNameUpdate(setState));

	const port: ReactiveLineLocalNamePort = {
		disabled: () => state().disabled,
		values: () => state().values,
	};

	return port as FromFormattingToReactivePort<T, ReactiveLineLocalNamePort>;
};
