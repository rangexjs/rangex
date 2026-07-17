import type { Component } from "solid-js";

export interface CreateSlotMountParams<Props extends object> {
	component: Component<Props>;
	container: Element;
	initialProps: Props;
}

export interface CreateSlotMountResult<Props extends object> {
	update: (props: Partial<Props>) => void;
	dispose: () => void;
}
