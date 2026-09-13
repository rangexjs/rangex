import { extendObjectProperties } from "#utilities";
import type {
	CreateSeparatorAdapterParams,
	CreateSeparatorAdapterResult,
	OnCanInsertUpdateCallbackFn,
	OnInsertCallbackFn,
	SeparatorConfigPort,
	SeparatorConfigPortProps,
	SeparatorInternals,
	SeparatorPublicPort,
	SeparatorPublicPortProps,
	UpdateStateParams,
} from "./SeparatorAdapter-types";

export const createSeparatorAdapter = (
	...params: CreateSeparatorAdapterParams
): CreateSeparatorAdapterResult => {
	const [_settings, _options] = params;

	const internals: SeparatorInternals = {
		// States
		canInsert: false,
	};

	// StateListeners
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> =
		new Set();

	// CommandListeners
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();

	const updateState = ({ canInsert }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			for (const listener of onCanInsertUpdateListeners) {
				listener(internals.canInsert);
			}
		}
	};

	const configPort: SeparatorConfigPort = extendObjectProperties({}, {
		updateState(params) {
			updateState(params);
		},

		onInsert(callback) {
			onInsertListeners.add(callback);
			return () => onInsertListeners.delete(callback);
		},
	} satisfies SeparatorConfigPortProps);

	const publicPort: SeparatorPublicPort = extendObjectProperties({}, {
		get canInsert() {
			return internals.canInsert;
		},

		onCanInsertUpdate(callback) {
			onCanInsertUpdateListeners.add(callback);
			return () => onCanInsertUpdateListeners.delete(callback);
		},

		insert() {
			for (const listener of onInsertListeners) {
				listener();
			}
		},
	} satisfies SeparatorPublicPortProps);

	return { configPort, publicPort };
};
