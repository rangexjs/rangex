import type { FormattingPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromFormattingToReactivePort,
	ReactiveLineSpacingPort,
} from "./_Utilities";

export const LineSpacing = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveLineSpacingPort> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<
			T,
			ReactiveLineSpacingPort
		>;
	}

	const [state, setState] = createSignal(formatting.lineSpacing);

	onCleanup(formatting.onLineSpacingUpdate(setState));

	const port: ReactiveLineSpacingPort = {
		disabled: () => state().disabled,
		values: () => state().values,
		default: formatting.defaultLineSpacing,
		set: formatting.setLineSpacing,
	};

	return port as FromFormattingToReactivePort<T, ReactiveLineSpacingPort>;
};
