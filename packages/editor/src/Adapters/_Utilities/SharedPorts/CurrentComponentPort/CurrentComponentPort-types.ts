import type { Component } from "@rangex/core";

export interface CurrentComponentInternals<TComponent extends Component> {
	hoverComponent: TComponent | null;
	selectionComponent: TComponent | null;
	// Last emitted values, compared against on update.
	currentComponent: TComponent | null;
	isSelectionActive: boolean;
}

export interface UpdateStateParams<TComponent extends Component> {
	hoverComponent?: TComponent | null;
	selectionComponent?: TComponent | null;
}

export type OnCurrentComponentUpdateCallbackFn = (
	currentComponent: HTMLElement | null,
) => void;

export type OnIsSelectionActiveUpdateCallbackFn = (
	isSelectionActive: boolean,
) => void;

export type OnConfigCurrentComponentUpdateCallbackFn<
	TComponent extends Component,
> = (currentComponent: TComponent | null) => void;

export interface CurrentComponentConfigPort<TComponent extends Component> {
	readonly currentComponent: TComponent | null;

	updateCurrentComponent(params: UpdateStateParams<TComponent>): void;

	onCurrentComponentUpdate(
		callback: OnConfigCurrentComponentUpdateCallbackFn<TComponent>,
	): () => void;
}

export interface CurrentComponentPublicPort {
	readonly currentComponent: HTMLElement | null;
	readonly isSelectionActive: boolean;

	onCurrentComponentUpdate(
		callback: OnCurrentComponentUpdateCallbackFn,
	): () => void;

	onIsSelectionActiveUpdate(
		callback: OnIsSelectionActiveUpdateCallbackFn,
	): () => void;
}

export interface CurrentComponentPort<TComponent extends Component> {
	configPort: CurrentComponentConfigPort<TComponent>;
	publicPort: CurrentComponentPublicPort;
}

export interface CreateCurrentComponentPortResult<TComponent extends Component>
	extends CurrentComponentPort<TComponent> {}
