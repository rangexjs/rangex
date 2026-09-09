import { extendObjectProperties } from "#utilities";
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
	const [_settings, _options] = params;

	const internals: TodoListInternals = {
		canInsert: false,
		canWrap: false,
	};

	// ConfigPort
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	const onWrapListeners: Set<OnWrapCallbackFn> = new Set();

	// PublicPort
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> =
		new Set();
	const onCanWrapUpdateListeners: Set<OnCanWrapUpdateCallbackFn> = new Set();

	const updateState = ({ canInsert, canWrap }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			for (const listener of onCanInsertUpdateListeners) {
				listener(internals.canInsert);
			}
		}

		if (canWrap !== undefined) {
			internals.canWrap = canWrap;

			for (const listener of onCanWrapUpdateListeners) {
				listener(internals.canWrap);
			}
		}
	};

	const configPort: TodoListConfigPort = extendObjectProperties({}, {
		updateState(params) {
			updateState(params);
		},

		onInsert(callback) {
			onInsertListeners.add(callback);
			return () => onInsertListeners.delete(callback);
		},

		onWrap(callback) {
			onWrapListeners.add(callback);
			return () => onWrapListeners.delete(callback);
		},
	} satisfies TodoListConfigPortProps);

	const publicPort: TodoListPublicPort = extendObjectProperties({}, {
		get canInsert() {
			return internals.canInsert;
		},

		get canWrap() {
			return internals.canWrap;
		},

		onCanInsertUpdate(callback) {
			onCanInsertUpdateListeners.add(callback);
			return () => onCanInsertUpdateListeners.delete(callback);
		},

		onCanWrapUpdate(callback) {
			onCanWrapUpdateListeners.add(callback);
			return () => onCanWrapUpdateListeners.delete(callback);
		},

		insert() {
			for (const listener of onInsertListeners) {
				listener();
			}
		},

		wrap() {
			for (const listener of onWrapListeners) {
				listener();
			}
		},
	} satisfies TodoListPublicPortProps);

	return { configPort, publicPort };
};
