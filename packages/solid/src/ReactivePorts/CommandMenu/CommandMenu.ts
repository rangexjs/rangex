import type { CommandMenuPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveCommandMenuPort } from "./CommandMenu-types";

export const CommandMenu = <T extends CommandMenuPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveCommandMenuPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveCommandMenuPort>;
	}

	const [query, setQuery] = createSignal(publicPort.caretMenu.query);

	onCleanup(publicPort.caretMenu.onQueryUpdate(setQuery));

	const port: ReactiveCommandMenuPort = {
		query,
		items: publicPort.items,
	};

	return port as PreserveUndefined<T, ReactiveCommandMenuPort>;
};
