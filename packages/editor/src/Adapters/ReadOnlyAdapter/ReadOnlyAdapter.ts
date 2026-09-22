import { extendObjectProperties } from "#utilities";
import { createEmitter } from "../_Utilities";
import type {
	CreateReadOnlyAdapterParams,
	CreateReadOnlyAdapterResult,
	OnCheckedUpdateCallbackFn,
	OnToggleCallbackFn,
	ReadOnlyConfigPort,
	ReadOnlyConfigPortProps,
	ReadOnlyInternals,
	ReadOnlyPublicPort,
	ReadOnlyPublicPortProps,
	UpdateStateParams,
} from "./ReadOnlyAdapter-types";

export const createReadOnlyAdapter = (
	..._params: CreateReadOnlyAdapterParams
): CreateReadOnlyAdapterResult => {
	const internals: ReadOnlyInternals = {
		// States
		checked: false,
	};

	// StateListeners
	const checkedUpdateEmitter = createEmitter<OnCheckedUpdateCallbackFn>();

	// CommandListeners
	const toggleEmitter = createEmitter<OnToggleCallbackFn>();

	const updateState = ({ checked }: UpdateStateParams) => {
		if (checked !== undefined) {
			internals.checked = checked;

			checkedUpdateEmitter.emit(internals.checked);
		}
	};

	const configPort: ReadOnlyConfigPort = extendObjectProperties({}, {
		updateState(params) {
			updateState(params);
		},

		onToggle(callback) {
			return toggleEmitter.subscribe(callback);
		},
	} satisfies ReadOnlyConfigPortProps);

	const publicPort: ReadOnlyPublicPort = extendObjectProperties({}, {
		get checked() {
			return internals.checked;
		},

		onCheckedUpdate(callback) {
			return checkedUpdateEmitter.subscribe(callback);
		},

		toggle() {
			toggleEmitter.emit(internals.checked);
		},
	} satisfies ReadOnlyPublicPortProps);

	return { configPort, publicPort };
};
