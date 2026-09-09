import type { ListPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type { ReactiveListPort, ReactiveListResult } from "./List-types";

export const List = (publicPort: ListPublicPort): ReactiveListResult => {
	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [canWrap, setCanWrap] = createSignal(publicPort.canWrap);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onCanInsertUpdate(setCanInsert));
	unsubscribeList.add(publicPort.onCanWrapUpdate(setCanWrap));

	const port: ReactiveListPort = {
		canInsert,
		canWrap,

		insert: publicPort.insert,
		wrap: publicPort.wrap,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
