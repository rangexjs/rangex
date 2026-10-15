import type { FormattingPublicPort } from "@rangex/editor/formatting";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromFormattingToReactivePort,
	ReactiveLineHeightPort,
} from "./_Utilities";

export const LineHeight = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveLineHeightPort> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<T, ReactiveLineHeightPort>;
	}

	const [state, setState] = createSignal(formatting.lineHeight);

	onCleanup(formatting.onLineHeightUpdate(setState));

	const port: ReactiveLineHeightPort = {
		disabled: () => state().disabled,
		hasUnset: () => state().hasUnset,
		values: () => state().values,
	};

	return port as FromFormattingToReactivePort<T, ReactiveLineHeightPort>;
};
