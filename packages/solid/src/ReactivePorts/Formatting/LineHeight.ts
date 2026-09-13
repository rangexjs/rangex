import type { FormattingPublicPort } from "@rangex/editor";
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
		values: () => state().values,
		default: formatting.defaultLineHeight,
		set: formatting.setLineHeight,
	};

	return port as FromFormattingToReactivePort<T, ReactiveLineHeightPort>;
};
