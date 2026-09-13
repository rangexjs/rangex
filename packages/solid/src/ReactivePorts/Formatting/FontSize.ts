import type { FormattingPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromFormattingToReactivePort,
	ReactiveFontSizePort,
} from "./_Utilities";

export const FontSize = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveFontSizePort> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<T, ReactiveFontSizePort>;
	}

	const [state, setState] = createSignal(formatting.fontSize);

	onCleanup(formatting.onFontSizeUpdate(setState));

	const port: ReactiveFontSizePort = {
		disabled: () => state().disabled,
		values: () => state().values,
		default: formatting.defaultFontSize,
		set: formatting.setFontSize,
	};

	return port as FromFormattingToReactivePort<T, ReactiveFontSizePort>;
};
