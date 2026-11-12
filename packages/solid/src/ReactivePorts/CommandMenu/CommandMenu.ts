import type { CommandMenuPublicPort } from "@rangex/editor/command-menu";
import { createSignal, onCleanup } from "solid-js";

import type { PreserveUndefined } from "../../_Utilities";
import { CaretMenu } from "../_Utilities";
import type { ReactiveCommandMenuPort } from "./CommandMenu-types";

export const CommandMenu = <T extends CommandMenuPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveCommandMenuPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveCommandMenuPort>;
	}

	const [availableItems, setAvailableItems] = createSignal(publicPort.availableItems);

	onCleanup(publicPort.onAvailableItemsUpdate(setAvailableItems));

	const port: ReactiveCommandMenuPort = {
		caretMenu: CaretMenu(publicPort.caretMenu),
		availableItems,
	};

	return port as PreserveUndefined<T, ReactiveCommandMenuPort>;
};
