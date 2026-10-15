import type { FormattingPublicPort } from "@rangex/editor/formatting";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromFormattingToReactivePort,
	ReactiveTextAlignPort,
} from "./_Utilities";

export const TextAlign = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveTextAlignPort> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<T, ReactiveTextAlignPort>;
	}

	const [state, setState] = createSignal(formatting.textAlign);

	onCleanup(formatting.onTextAlignUpdate(setState));

	const port: ReactiveTextAlignPort = {
		disabled: () => state().disabled,
		hasUnset: () => state().hasUnset,
		values: () => state().values,
	};

	return port as FromFormattingToReactivePort<T, ReactiveTextAlignPort>;
};
