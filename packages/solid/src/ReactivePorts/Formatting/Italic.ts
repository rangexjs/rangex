import type { FormattingPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromFormattingToReactivePort,
	ReactiveFormattingToggleButton,
} from "./_Utilities";

export const Italic = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveFormattingToggleButton> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<
			T,
			ReactiveFormattingToggleButton
		>;
	}

	const [state, setState] = createSignal(formatting.italic);

	onCleanup(formatting.onItalicUpdate(setState));

	const port: ReactiveFormattingToggleButton = {
		checked: () => state().checked,
		pressed: () => state().pressed,
		disabled: () => state().disabled,
		toggle: formatting.toggleItalic,
	};

	return port as FromFormattingToReactivePort<
		T,
		ReactiveFormattingToggleButton
	>;
};
