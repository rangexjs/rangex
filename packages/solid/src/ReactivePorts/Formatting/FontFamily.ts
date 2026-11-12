import type { FormattingPublicPort } from "@rangex/editor/formatting";
import { createSignal, onCleanup } from "solid-js";

import type { FromFormattingToReactivePort, ReactiveFontFamilyPort } from "./_Utilities";

export const FontFamily = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveFontFamilyPort> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<T, ReactiveFontFamilyPort>;
	}

	const [state, setState] = createSignal(formatting.fontFamily);

	onCleanup(formatting.onFontFamilyUpdate(setState));

	const port: ReactiveFontFamilyPort = {
		disabled: () => state().disabled,
		hasUnset: () => state().hasUnset,
		values: () => state().values,
	};

	return port as FromFormattingToReactivePort<T, ReactiveFontFamilyPort>;
};
