import type { BlockComponent } from "@rangex/core";

import { extendObjectProperties } from "#utilities";

import {
	createCurrentComponentPort,
	createEmitter,
	createStateEmitter,
	createUnwrapPort,
} from "../_Utilities";
import type {
	CreateTodoListAdapterParams,
	CreateTodoListAdapterResult,
	OnInsertCallbackFn,
	OnWrapCallbackFn,
	TodoListConfigPort,
	TodoListConfigPortProps,
	TodoListPublicPort,
	TodoListPublicPortProps,
	UpdateStateParams,
} from "./TodoListAdapter-types";

export const createTodoListAdapter = (
	...params: CreateTodoListAdapterParams
): CreateTodoListAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("todoList");

	// States
	const canInsertState = createStateEmitter<boolean>(false);
	const canWrapState = createStateEmitter<boolean>(false);

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const wrapEmitter = createEmitter<OnWrapCallbackFn>();

	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();

	const updateState = ({ canInsert, canWrap }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			canInsertState.set(canInsert);
		}

		if (canWrap !== undefined) {
			canWrapState.set(canWrap);
		}
	};

	const configPort: TodoListConfigPort = extendObjectProperties(
		unwrapPort.configPort,
		currentComponentPort.configPort,
		{
			updateState(params) {
				updateState(params);
			},

			onInsert(callback) {
				return insertEmitter.subscribe(callback);
			},

			onWrap(callback) {
				return wrapEmitter.subscribe(callback);
			},
		} satisfies TodoListConfigPortProps,
	);

	const publicPort: TodoListPublicPort = extendObjectProperties(
		unwrapPort.publicPort,
		currentComponentPort.publicPort,
		{
			get canInsert() {
				return canInsertState.get();
			},

			get canWrap() {
				return canWrapState.get();
			},

			onCanInsertUpdate(callback) {
				return canInsertState.subscribe(callback);
			},

			onCanWrapUpdate(callback) {
				return canWrapState.subscribe(callback);
			},

			insert() {
				insertEmitter.emit();
			},

			wrap() {
				wrapEmitter.emit();
			},
		} satisfies TodoListPublicPortProps,
	);

	return { configPort, publicPort };
};
