import type { BlockComponent } from "rich-text-area";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
	createEmitter,
	createUnwrapPort,
} from "../_Utilities";
import type {
	CreateTodoListAdapterParams,
	CreateTodoListAdapterResult,
	OnCanInsertUpdateCallbackFn,
	OnCanWrapUpdateCallbackFn,
	OnInsertCallbackFn,
	OnWrapCallbackFn,
	TodoListConfigPort,
	TodoListConfigPortProps,
	TodoListInternals,
	TodoListPublicPort,
	TodoListPublicPortProps,
	UpdateStateParams,
} from "./TodoListAdapter-types";

export const createTodoListAdapter = (
	...params: CreateTodoListAdapterParams
): CreateTodoListAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("todoList");

	const internals: TodoListInternals = {
		// States
		canInsert: false,
		canWrap: false,
	};

	// StateListeners
	const canInsertUpdateEmitter = createEmitter<OnCanInsertUpdateCallbackFn>();
	const canWrapUpdateEmitter = createEmitter<OnCanWrapUpdateCallbackFn>();

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const wrapEmitter = createEmitter<OnWrapCallbackFn>();

	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();

	const updateState = ({ canInsert, canWrap }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			canInsertUpdateEmitter.emit(internals.canInsert);
		}

		if (canWrap !== undefined) {
			internals.canWrap = canWrap;

			canWrapUpdateEmitter.emit(internals.canWrap);
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
				return internals.canInsert;
			},

			get canWrap() {
				return internals.canWrap;
			},

			onCanInsertUpdate(callback) {
				return canInsertUpdateEmitter.subscribe(callback);
			},

			onCanWrapUpdate(callback) {
				return canWrapUpdateEmitter.subscribe(callback);
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
