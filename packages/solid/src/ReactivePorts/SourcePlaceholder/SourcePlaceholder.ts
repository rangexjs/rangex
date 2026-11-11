import type { SourcePlaceholderPublicPort } from "@rangex/editor/source-placeholder";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveSourcePlaceholderPort } from "./SourcePlaceholder-types";

export const SourcePlaceholder = <
	T extends SourcePlaceholderPublicPort | undefined,
>(
	publicPort: T,
): PreserveUndefined<T, ReactiveSourcePlaceholderPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveSourcePlaceholderPort>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));

	const port: ReactiveSourcePlaceholderPort = {
		canInsert,
	};

	return port as PreserveUndefined<T, ReactiveSourcePlaceholderPort>;
};
