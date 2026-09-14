import type { FormattingPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromFormattingToReactivePort,
	ReactiveFormattingToggleButton,
} from "./_Utilities";

export const Underline = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveFormattingToggleButton> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<
			T,
			ReactiveFormattingToggleButton
		>;
	}

	const [state, setState] = createSignal(formatting.underline);

	onCleanup(formatting.onUnderlineUpdate(setState));

	const port: ReactiveFormattingToggleButton = {
		checked: () => state().checked,
		pressed: () => state().pressed,
		disabled: () => state().disabled,
	};

	return port as FromFormattingToReactivePort<
		T,
		ReactiveFormattingToggleButton
	>;
};
