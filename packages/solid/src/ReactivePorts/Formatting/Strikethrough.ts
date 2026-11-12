import type { FormattingPublicPort } from "@rangex/editor/formatting";
import { createSignal, onCleanup } from "solid-js";

import type { FromFormattingToReactivePort, ReactiveFormattingToggleButton } from "./_Utilities";

export const Strikethrough = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveFormattingToggleButton> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<T, ReactiveFormattingToggleButton>;
	}

	const [state, setState] = createSignal(formatting.strikethrough);

	onCleanup(formatting.onStrikethroughUpdate(setState));

	const port: ReactiveFormattingToggleButton = {
		checked: () => state().checked,
		pressed: () => state().pressed,
		disabled: () => state().disabled,
	};

	return port as FromFormattingToReactivePort<T, ReactiveFormattingToggleButton>;
};
