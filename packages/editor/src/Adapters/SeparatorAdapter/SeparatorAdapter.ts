import { extendObjectProperties } from "#utilities";
import { createEmitter } from "../_Utilities";
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
	const canInsertUpdateEmitter = createEmitter<OnCanInsertUpdateCallbackFn>();

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();

	const updateState = ({ canInsert }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			canInsertUpdateEmitter.emit(internals.canInsert);
		}
	};

	const configPort: SeparatorConfigPort = extendObjectProperties({}, {
		updateState(params) {
			updateState(params);
		},

		onInsert(callback) {
			return insertEmitter.subscribe(callback);
		},
	} satisfies SeparatorConfigPortProps);

	const publicPort: SeparatorPublicPort = extendObjectProperties({}, {
		get canInsert() {
			return internals.canInsert;
		},

		onCanInsertUpdate(callback) {
			return canInsertUpdateEmitter.subscribe(callback);
		},

		insert() {
			insertEmitter.emit();
		},
	} satisfies SeparatorPublicPortProps);

	return { configPort, publicPort };
};
