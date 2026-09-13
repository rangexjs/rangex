import type { FormattingPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromFormattingToReactivePort,
	ReactiveFormattingToggleButton,
} from "./_Utilities";

export const Bold = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveFormattingToggleButton> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<
			T,
			ReactiveFormattingToggleButton
		>;
	}

	const [state, setState] = createSignal(formatting.bold);

	onCleanup(formatting.onBoldUpdate(setState));

	const port: ReactiveFormattingToggleButton = {
		checked: () => state().checked,
		pressed: () => state().pressed,
		disabled: () => state().disabled,
		toggle: formatting.toggleBold,
	};

	return port as FromFormattingToReactivePort<
		T,
		ReactiveFormattingToggleButton
	>;
};
