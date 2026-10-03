import type { Component } from "@rangex/core";
import { createStateEmitter } from "../../CreateStateEmitter";
import type {
	CreateCurrentComponentPortResult,
	CurrentComponentConfigPort,
	CurrentComponentInternals,
	CurrentComponentPublicPort,
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

	// States
	const currentComponentState = createStateEmitter<TComponent | null>(null);
	const isSelectionActiveState = createStateEmitter<boolean>(false);

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

		currentComponentState.set(currentComponent);

		const isSelectionActive = resolveIsSelectionActive();

		isSelectionActiveState.set(isSelectionActive);
	};

	const configPort: CurrentComponentConfigPort<TComponent> = {
		get currentComponent() {
			return resolveCurrentComponent();
		},

		updateCurrentComponent(params) {
			updateState(params);
		},

		onCurrentComponentUpdate(callback) {
			return currentComponentState.subscribe(callback);
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
			return currentComponentState.subscribe(callback);
		},

		onIsSelectionActiveUpdate(callback) {
			return isSelectionActiveState.subscribe(callback);
		},
	};

	return { configPort, publicPort };
};
