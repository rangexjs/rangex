import type { Component } from "solid-js";

export interface InitializeOverlayHostParams {
	container: HTMLElement;
}

export interface MountOverlayHostParams<Props extends object> {
	component: Component<Props>;
	props: Props;
}

export interface MountOverlayHostResult {
	element: HTMLDivElement;
	unmount(): void;
}
