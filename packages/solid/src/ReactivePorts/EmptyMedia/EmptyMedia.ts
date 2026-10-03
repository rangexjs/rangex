import type { EmptyMediaPublicPort } from "@rangex/editor/empty-media";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveEmptyMediaPort } from "./EmptyMedia-types";

export const EmptyMedia = <T extends EmptyMediaPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveEmptyMediaPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveEmptyMediaPort>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));

	const port: ReactiveEmptyMediaPort = {
		canInsert,
	};

	return port as PreserveUndefined<T, ReactiveEmptyMediaPort>;
};
