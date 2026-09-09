import { extendObjectProperties } from "#utilities";
import type {
	CreateListAdapterParams,
	CreateListAdapterResult,
	ListConfigPort,
	ListConfigPortProps,
	ListInternals,
	ListPublicPort,
	ListPublicPortProps,
	OnCanInsertUpdateCallbackFn,
	OnCanWrapUpdateCallbackFn,
	OnInsertCallbackFn,
	OnWrapCallbackFn,
	UpdateStateParams,
} from "./ListAdapter-types";

export const createListAdapter = (
	...params: CreateListAdapterParams
): CreateListAdapterResult => {
	const [_settings, _options] = params;

	const internals: ListInternals = {
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

	const configPort: ListConfigPort = extendObjectProperties({}, {
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
	} satisfies ListConfigPortProps);

	const publicPort: ListPublicPort = extendObjectProperties({}, {
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

		insert(params) {
			for (const listener of onInsertListeners) {
				listener(params);
			}
		},

		wrap(params) {
			for (const listener of onWrapListeners) {
				listener(params);
			}
		},
	} satisfies ListPublicPortProps);

	return { configPort, publicPort };
};
