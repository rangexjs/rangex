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
	const [isActive, setIsActive] = createSignal(publicPort.isActive);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));
	onCleanup(publicPort.onIsActiveUpdate(setIsActive));

	const port: ReactiveListPort = {
		canInsert,
		canWrap,
		isActive,
	};

	return port as PreserveUndefined<T, ReactiveListPort>;
};
