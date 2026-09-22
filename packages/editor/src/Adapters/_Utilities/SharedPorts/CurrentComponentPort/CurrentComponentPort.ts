import type { Component } from "rich-text-area";
import { createEmitter } from "../../CreateEmitter";
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
	const currentComponentUpdateEmitter =
		createEmitter<OnCurrentComponentUpdateCallbackFn>();

	const updateState = ({ currentComponent }: UpdateStateParams<TComponent>) => {
		if (currentComponent !== undefined) {
			internals.currentComponent = currentComponent;

			currentComponentUpdateEmitter.emit(internals.currentComponent);
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
			return currentComponentUpdateEmitter.subscribe(callback);
		},
	};

	return { configPort, publicPort };
};
