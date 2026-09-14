import type { TodoListPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveTodoListPort } from "./TodoList-types";

export const TodoList = <T extends TodoListPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveTodoListPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveTodoListPort>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [canWrap, setCanWrap] = createSignal(publicPort.canWrap);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));

	const port: ReactiveTodoListPort = {
		canInsert,
		canWrap,

		insert: publicPort.insert,
		wrap: publicPort.wrap,
	};

	return port as PreserveUndefined<T, ReactiveTodoListPort>;
};
