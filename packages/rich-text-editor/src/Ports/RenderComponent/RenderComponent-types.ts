import type { Component } from "solid-js";

export interface RenderComponentParams<Props extends object> {
	container: HTMLElement;
	component: Component<Props>;
	props: Props;
}

export type RenderComponentResult = () => void;
