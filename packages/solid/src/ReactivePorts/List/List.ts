import type { ListPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveListPort } from "./List-types";

export const List = <T extends ListPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveListPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveListPort>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [canWrap, setCanWrap] = createSignal(publicPort.canWrap);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));

	const port: ReactiveListPort = {
		canInsert,
		canWrap,
	};

	return port as PreserveUndefined<T, ReactiveListPort>;
};
