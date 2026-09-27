import type { Component } from "rich-text-area";

export interface CurrentComponentInternals<TComponent extends Component> {
	hoverComponent: TComponent | null;
	selectionComponent: TComponent | null;
}

export interface UpdateStateParams<TComponent extends Component> {
	hoverComponent?: TComponent | null;
	selectionComponent?: TComponent | null;
}

export type OnCurrentComponentUpdateCallbackFn = (
	currentComponent: HTMLElement | null,
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

	onCurrentComponentUpdate(
		callback: OnCurrentComponentUpdateCallbackFn,
	): () => void;
}

export interface CurrentComponentPort<TComponent extends Component> {
	configPort: CurrentComponentConfigPort<TComponent>;
	publicPort: CurrentComponentPublicPort;
}

export interface CreateCurrentComponentPortResult<TComponent extends Component>
	extends CurrentComponentPort<TComponent> {}
