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
	const [isActive, setIsActive] = createSignal(publicPort.isActive);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));
	onCleanup(publicPort.onIsActiveUpdate(setIsActive));

	const port: ReactiveTodoListPort = {
		canInsert,
		canWrap,
		isActive,
	};

	return port as PreserveUndefined<T, ReactiveTodoListPort>;
};
