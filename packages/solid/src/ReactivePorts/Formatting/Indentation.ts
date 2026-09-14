import type { FormattingPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromFormattingToReactivePort,
	ReactiveIndentationPort,
} from "./_Utilities";

export const Indentation = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveIndentationPort> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<
			T,
			ReactiveIndentationPort
		>;
	}

	const [state, setState] = createSignal(formatting.indentation);

	onCleanup(formatting.onIndentationUpdate(setState));

	const port: ReactiveIndentationPort = {
		disabled: () => state().disabled,
		values: () => state().values,
	};

	return port as FromFormattingToReactivePort<T, ReactiveIndentationPort>;
};
