import type { Component } from "rich-text-area";
import { createEmitter } from "../../CreateEmitter";
import type {
	CreateCurrentComponentPortResult,
	CurrentComponentConfigPort,
	CurrentComponentInternals,
	CurrentComponentPublicPort,
	OnConfigCurrentComponentUpdateCallbackFn,
	OnIsSelectionActiveUpdateCallbackFn,
	UpdateStateParams,
} from "./CurrentComponentPort-types";

/*
 * Tracks the hovered and the selection-containing component separately and exposes a single
 * resolved current component: the hovered one when present, otherwise the selection one, skipping
 * any that is detached from the document. Also exposes whether the selection is inside a component.
 * Each state emits only when it changes.
 */
export const createCurrentComponentPort = <
	TComponent extends Component,
>(): CreateCurrentComponentPortResult<TComponent> => {
	const internals: CurrentComponentInternals<TComponent> = {
		hoverComponent: null,
		selectionComponent: null,
		currentComponent: null,
		isSelectionActive: false,
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

	const resolveIsSelectionActive = () =>
		!!internals.selectionComponent?.$$rootEditable;

	// StateListeners
	const currentComponentUpdateEmitter =
		createEmitter<OnConfigCurrentComponentUpdateCallbackFn<TComponent>>();
	const isSelectionActiveUpdateEmitter =
		createEmitter<OnIsSelectionActiveUpdateCallbackFn>();

	const updateState = ({
		hoverComponent,
		selectionComponent,
	}: UpdateStateParams<TComponent>) => {
		if (hoverComponent !== undefined) {
			internals.hoverComponent = hoverComponent;
		}

		if (selectionComponent !== undefined) {
			internals.selectionComponent = selectionComponent;
		}

		const currentComponent = resolveCurrentComponent();

		if (currentComponent !== internals.currentComponent) {
			internals.currentComponent = currentComponent;

			currentComponentUpdateEmitter.emit(currentComponent);
		}

		const isSelectionActive = resolveIsSelectionActive();

		if (isSelectionActive !== internals.isSelectionActive) {
			internals.isSelectionActive = isSelectionActive;

			isSelectionActiveUpdateEmitter.emit(isSelectionActive);
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

		get isSelectionActive() {
			return resolveIsSelectionActive();
		},

		onCurrentComponentUpdate(callback) {
			return currentComponentUpdateEmitter.subscribe(callback);
		},

		onIsSelectionActiveUpdate(callback) {
			return isSelectionActiveUpdateEmitter.subscribe(callback);
		},
	};

	return { configPort, publicPort };
};
