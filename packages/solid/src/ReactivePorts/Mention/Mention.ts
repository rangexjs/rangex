import type { MentionPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveMentionPort } from "./Mention-types";

export const Mention = <T extends MentionPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveMentionPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveMentionPort>;
	}

	const [filteredItems, setFilteredItems] = createSignal(
		publicPort.filteredItems,
	);

	onCleanup(publicPort.onFilteredItemsUpdate(setFilteredItems));

	const port: ReactiveMentionPort = {
		filteredItems,
	};

	return port as PreserveUndefined<T, ReactiveMentionPort>;
};
