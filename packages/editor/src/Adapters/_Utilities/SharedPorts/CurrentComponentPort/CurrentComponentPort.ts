import type { Component } from "rich-text-area";
import type {
	CreateCurrentComponentPortResult,
	CurrentComponentConfigPort,
	CurrentComponentInternals,
	CurrentComponentPublicPort,
	OnCurrentComponentUpdateCallbackFn,
	UpdateStateParams,
} from "./CurrentComponentPort-types";

export const createCurrentComponentPort = <
	TComponent extends Component,
>(): CreateCurrentComponentPortResult<TComponent> => {
	const internals: CurrentComponentInternals<TComponent> = {
		currentComponent: null,
	};

	// StateListeners
	const onCurrentComponentUpdateListeners: Set<OnCurrentComponentUpdateCallbackFn> =
		new Set();

	const updateState = ({ currentComponent }: UpdateStateParams<TComponent>) => {
		if (currentComponent !== undefined) {
			internals.currentComponent = currentComponent;

			for (const listener of onCurrentComponentUpdateListeners) {
				listener(internals.currentComponent);
			}
		}
	};

	const configPort: CurrentComponentConfigPort<TComponent> = {
		get currentComponent() {
			return internals.currentComponent;
		},

		updateCurrentComponent(params) {
			updateState(params);
		},
	};

	const publicPort: CurrentComponentPublicPort = {
		get currentComponent() {
			return internals.currentComponent;
		},

		onCurrentComponentUpdate(callback) {
			onCurrentComponentUpdateListeners.add(callback);
			return () => onCurrentComponentUpdateListeners.delete(callback);
		},
	};

	return { configPort, publicPort };
};
