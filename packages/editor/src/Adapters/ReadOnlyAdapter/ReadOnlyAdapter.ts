import { extendObjectProperties } from "#utilities";
import { createEmitter, createStateEmitter } from "../_Utilities";
import type {
	CreateReadOnlyAdapterParams,
	CreateReadOnlyAdapterResult,
	OnToggleCallbackFn,
	ReadOnlyConfigPort,
	ReadOnlyConfigPortProps,
	ReadOnlyPublicPort,
	ReadOnlyPublicPortProps,
	UpdateStateParams,
} from "./ReadOnlyAdapter-types";

export const createReadOnlyAdapter = (
	...params: CreateReadOnlyAdapterParams
): CreateReadOnlyAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("readOnly");

	// States
	const checkedState = createStateEmitter<boolean>(false);

	// CommandListeners
	const toggleEmitter = createEmitter<OnToggleCallbackFn>();

	const updateState = ({ checked }: UpdateStateParams) => {
		if (checked !== undefined) {
			checkedState.set(checked);
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
			return checkedState.get();
		},

		onCheckedUpdate(callback) {
			return checkedState.subscribe(callback);
		},

		toggle() {
			toggleEmitter.emit(checkedState.get());
		},
	} satisfies ReadOnlyPublicPortProps);

	return { configPort, publicPort };
};
