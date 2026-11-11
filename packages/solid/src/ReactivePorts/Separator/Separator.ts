import type { SeparatorPublicPort } from "@rangex/editor/separator";
import { createSignal, onCleanup } from "solid-js";

import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveSeparatorPort } from "./Separator-types";

export const Separator = <T extends SeparatorPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveSeparatorPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveSeparatorPort>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));

	const port: ReactiveSeparatorPort = {
		canInsert,
	};

	return port as PreserveUndefined<T, ReactiveSeparatorPort>;
};
