import { extendObjectProperties } from "#utilities";
import type {
	BlockQuoteConfigPort,
	BlockQuoteConfigPortProps,
	BlockQuoteInternals,
	BlockQuotePublicPort,
	BlockQuotePublicPortProps,
	CreateBlockQuoteAdapterParams,
	CreateBlockQuoteAdapterResult,
	OnCanInsertUpdateCallbackFn,
	OnCanWrapUpdateCallbackFn,
	OnInsertCallbackFn,
	OnWrapCallbackFn,
	UpdateStateParams,
} from "./BlockQuoteAdapter-types";

export const createBlockQuoteAdapter = (
	...params: CreateBlockQuoteAdapterParams
): CreateBlockQuoteAdapterResult => {
	const [_settings, _options] = params;

	const internals: BlockQuoteInternals = {
		// States
		canInsert: false,
		canWrap: false,
	};

	// StateListeners
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> =
		new Set();
	const onCanWrapUpdateListeners: Set<OnCanWrapUpdateCallbackFn> = new Set();

	// CommandListeners
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	const onWrapListeners: Set<OnWrapCallbackFn> = new Set();

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

	const configPort: BlockQuoteConfigPort = extendObjectProperties({}, {
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
	} satisfies BlockQuoteConfigPortProps);

	const publicPort: BlockQuotePublicPort = extendObjectProperties({}, {
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
	} satisfies BlockQuotePublicPortProps);

	return { configPort, publicPort };
};
