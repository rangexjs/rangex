import type { Component } from "rich-text-area";
import { createEmitter } from "../../CreateEmitter";
import type {
	CreateCurrentComponentPortResult,
	CurrentComponentConfigPort,
	CurrentComponentInternals,
	CurrentComponentPublicPort,
	OnConfigCurrentComponentUpdateCallbackFn,
	UpdateStateParams,
} from "./CurrentComponentPort-types";

/*
 * Tracks the hovered and the selection-containing component separately and exposes a single
 * resolved current component: the hovered one when present, otherwise the selection one, skipping
 * any that is detached from the document. Emits only when the resolved component changes.
 */
export const createCurrentComponentPort = <
	TComponent extends Component,
>(): CreateCurrentComponentPortResult<TComponent> => {
	const internals: CurrentComponentInternals<TComponent> = {
		hoverComponent: null,
		selectionComponent: null,
	};

	const resolveCurrentComponent = () => {
		const { hoverComponent, selectionComponent } = internals;

		if (hoverComponent?.$$rootEditable) {
			return hoverComponent;
		}

		if (selectionComponent?.$$rootEditable) {
			return selectionComponent;
		}

		return null;
	};

	// StateListeners
	const currentComponentUpdateEmitter =
		createEmitter<OnConfigCurrentComponentUpdateCallbackFn<TComponent>>();

	const updateState = ({
		hoverComponent,
		selectionComponent,
	}: UpdateStateParams<TComponent>) => {
		const previousComponent = resolveCurrentComponent();

		if (hoverComponent !== undefined) {
			internals.hoverComponent = hoverComponent;
		}

		if (selectionComponent !== undefined) {
			internals.selectionComponent = selectionComponent;
		}

		const currentComponent = resolveCurrentComponent();

		if (currentComponent !== previousComponent) {
			currentComponentUpdateEmitter.emit(currentComponent);
		}
	};

	const configPort: CurrentComponentConfigPort<TComponent> = {
		get currentComponent() {
			return resolveCurrentComponent();
		},

		updateCurrentComponent(params) {
			updateState(params);
		},

		onCurrentComponentUpdate(callback) {
			return currentComponentUpdateEmitter.subscribe(callback);
		},
	};

	const publicPort: CurrentComponentPublicPort = {
		get currentComponent() {
			return resolveCurrentComponent();
		},

		onCurrentComponentUpdate(callback) {
			return currentComponentUpdateEmitter.subscribe(callback);
		},
	};

	return { configPort, publicPort };
};
