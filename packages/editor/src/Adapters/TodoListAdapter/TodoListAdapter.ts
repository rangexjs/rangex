import { extendObjectProperties } from "#utilities";
import { createEmitter, createUnwrapPort } from "../_Utilities";
import type {
	CreateTodoListAdapterParams,
	CreateTodoListAdapterResult,
	OnCanInsertUpdateCallbackFn,
	OnCanWrapUpdateCallbackFn,
	OnInsertCallbackFn,
	OnIsActiveUpdateCallbackFn,
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
		isActive: false,
	};

	// StateListeners
	const canInsertUpdateEmitter = createEmitter<OnCanInsertUpdateCallbackFn>();
	const canWrapUpdateEmitter = createEmitter<OnCanWrapUpdateCallbackFn>();
	const isActiveUpdateEmitter = createEmitter<OnIsActiveUpdateCallbackFn>();

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const wrapEmitter = createEmitter<OnWrapCallbackFn>();

	const unwrapPort = createUnwrapPort();

	const updateState = ({ canInsert, canWrap, isActive }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			canInsertUpdateEmitter.emit(internals.canInsert);
		}

		if (canWrap !== undefined) {
			internals.canWrap = canWrap;

			canWrapUpdateEmitter.emit(internals.canWrap);
		}

		if (isActive !== undefined) {
			internals.isActive = isActive;

			isActiveUpdateEmitter.emit(internals.isActive);
		}
	};

	const configPort: TodoListConfigPort = extendObjectProperties(
		unwrapPort.configPort,
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
		{
			get canInsert() {
				return internals.canInsert;
			},

			get canWrap() {
				return internals.canWrap;
			},

			get isActive() {
				return internals.isActive;
			},

			onCanInsertUpdate(callback) {
				return canInsertUpdateEmitter.subscribe(callback);
			},

			onCanWrapUpdate(callback) {
				return canWrapUpdateEmitter.subscribe(callback);
			},

			onIsActiveUpdate(callback) {
				return isActiveUpdateEmitter.subscribe(callback);
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
