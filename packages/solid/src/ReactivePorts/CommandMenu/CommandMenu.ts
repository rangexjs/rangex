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

	const [filteredItems, setFilteredItems] = createSignal(
		publicPort.filteredItems,
	);

	onCleanup(publicPort.onFilteredItemsUpdate(setFilteredItems));

	const port: ReactiveCommandMenuPort = {
		filteredItems,
	};

	return port as PreserveUndefined<T, ReactiveCommandMenuPort>;
};
