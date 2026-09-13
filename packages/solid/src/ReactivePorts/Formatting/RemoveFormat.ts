import type { FormattingPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromFormattingToReactivePort,
	ReactiveRemoveFormatPort,
} from "./_Utilities";

export const RemoveFormat = <T extends FormattingPublicPort | undefined>(
	formatting: T,
): FromFormattingToReactivePort<T, ReactiveRemoveFormatPort> => {
	if (!formatting) {
		return undefined as FromFormattingToReactivePort<
			T,
			ReactiveRemoveFormatPort
		>;
	}

	const [removeLine, setRemoveLine] = createSignal(formatting.removeLine);
	const [removeText, setRemoveText] = createSignal(formatting.removeText);

	onCleanup(formatting.onRemoveLineUpdate(setRemoveLine));
	onCleanup(formatting.onRemoveTextUpdate(setRemoveText));

	const port: ReactiveRemoveFormatPort = {
		disabled: () => removeLine().disabled && removeText().disabled,
		remove: () => {
			formatting.removeLineFormat();
			formatting.removeTextFormat();
		},
	};

	return port as FromFormattingToReactivePort<T, ReactiveRemoveFormatPort>;
};
