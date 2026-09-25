import type { CaretMenuPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { ReactiveCaretMenuPort } from "./CaretMenu-types";

export const CaretMenu = (
	publicPort: CaretMenuPublicPort,
): ReactiveCaretMenuPort => {
	const [query, setQuery] = createSignal(publicPort.query);

	onCleanup(publicPort.onQueryUpdate(setQuery));

	const port: ReactiveCaretMenuPort = {
		query,
	};

	return port;
};
