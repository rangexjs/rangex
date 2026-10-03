import type { TodoListPublicPort } from "@rangex/editor/todo-list";
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
	const [currentComponent, setCurrentComponent] = createSignal(
		publicPort.currentComponent,
	);
	const [isSelectionActive, setIsSelectionActive] = createSignal(
		publicPort.isSelectionActive,
	);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentComponent));
	onCleanup(publicPort.onIsSelectionActiveUpdate(setIsSelectionActive));

	const port: ReactiveTodoListPort = {
		canInsert,
		canWrap,
		currentComponent,
		isSelectionActive,
	};

	return port as PreserveUndefined<T, ReactiveTodoListPort>;
};
