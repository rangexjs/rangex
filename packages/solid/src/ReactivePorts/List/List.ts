import type { ListPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveListPort } from "./List-types";

export const List = <T extends ListPublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [canWrap, setCanWrap] = createSignal(publicPort.canWrap);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));

	const port: ReactiveListPort = {
		canInsert,
		canWrap,

		insert: publicPort.insert,
		wrap: publicPort.wrap,
	};

	return port as FromPublicToReactivePort<T>;
};
