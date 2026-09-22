import type { FormattingPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromFormattingToReactivePort,
	ReactiveColorPort,
} from "./_Utilities";

export const Color = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveColorPort> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<T, ReactiveColorPort>;
	}

	const [state, setState] = createSignal(formatting.color);

	onCleanup(formatting.onColorUpdate(setState));

	const port: ReactiveColorPort = {
		disabled: () => state().disabled,
		values: () => state().values,
	};

	return port as FromFormattingToReactivePort<T, ReactiveColorPort>;
};
