import type { TodoListPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type {
	ReactiveTodoListPort,
	ReactiveTodoListResult,
} from "./TodoList-types";

export const TodoList = (
	publicPort: TodoListPublicPort,
): ReactiveTodoListResult => {
	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [canWrap, setCanWrap] = createSignal(publicPort.canWrap);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onCanInsertUpdate(setCanInsert));
	unsubscribeList.add(publicPort.onCanWrapUpdate(setCanWrap));

	const port: ReactiveTodoListPort = {
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
