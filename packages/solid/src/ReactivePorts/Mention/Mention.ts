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

	const [query, setQuery] = createSignal(publicPort.caretMenu.query);

	onCleanup(publicPort.caretMenu.onQueryUpdate(setQuery));

	const port: ReactiveMentionPort = {
		query,
	};

	return port as PreserveUndefined<T, ReactiveMentionPort>;
};
