import type { FormattingPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromFormattingToReactivePort,
	ReactiveBackgroundColorPort,
} from "./_Utilities";

export const BackgroundColor = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveBackgroundColorPort> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<
			T,
			ReactiveBackgroundColorPort
		>;
	}

	const [state, setState] = createSignal(formatting.backgroundColor);

	onCleanup(formatting.onBackgroundColorUpdate(setState));

	const port: ReactiveBackgroundColorPort = {
		disabled: () => state().disabled,
		values: () => state().values,
	};

	return port as FromFormattingToReactivePort<T, ReactiveBackgroundColorPort>;
};
