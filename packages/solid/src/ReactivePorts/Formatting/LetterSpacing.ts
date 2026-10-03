import type { FormattingPublicPort } from "@rangex/editor/formatting";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromFormattingToReactivePort,
	ReactiveLetterSpacingPort,
} from "./_Utilities";

export const LetterSpacing = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveLetterSpacingPort> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<
			T,
			ReactiveLetterSpacingPort
		>;
	}

	const [state, setState] = createSignal(formatting.letterSpacing);

	onCleanup(formatting.onLetterSpacingUpdate(setState));

	const port: ReactiveLetterSpacingPort = {
		disabled: () => state().disabled,
		values: () => state().values,
	};

	return port as FromFormattingToReactivePort<T, ReactiveLetterSpacingPort>;
};
