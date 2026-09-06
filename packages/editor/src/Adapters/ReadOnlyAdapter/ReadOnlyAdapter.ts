import { extendObjectProperties } from "#utilities";
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
		checked: false,
	};

	// ConfigPort
	const onToggleListeners: Set<OnToggleCallbackFn> = new Set();

	// PublicPort
	const onCheckedUpdateListeners: Set<OnCheckedUpdateCallbackFn> = new Set();

	const updateState = ({ checked }: UpdateStateParams) => {
		if (checked !== undefined) {
			internals.checked = checked;

			for (const listener of onCheckedUpdateListeners) {
				listener(internals.checked);
			}
		}
	};

	const configPort: ReadOnlyConfigPort = extendObjectProperties({}, {
		updateState(params) {
			updateState(params);
		},

		onToggle(callback) {
			onToggleListeners.add(callback);
			return () => onToggleListeners.delete(callback);
		},
	} satisfies ReadOnlyConfigPortProps);

	const publicPort: ReadOnlyPublicPort = extendObjectProperties({}, {
		get checked() {
			return internals.checked;
		},

		onCheckedUpdate(callback) {
			onCheckedUpdateListeners.add(callback);
			return () => onCheckedUpdateListeners.delete(callback);
		},

		toggle() {
			for (const listener of onToggleListeners) {
				listener(internals.checked);
			}
		},
	} satisfies ReadOnlyPublicPortProps);

	return { configPort, publicPort };
};
