import type { Component } from "solid-js";
import type { OverlayHost } from "#ports";

export interface CreateOverlayMountParams<Props extends object> {
	overlayHost: OverlayHost;
	component: Component<Props>;
	getProps: () => Props;
}

export interface UIOverlayMount {
	setElement: (element: HTMLDivElement) => void;
}

export interface EditorOverlayMount {
	readonly element: HTMLDivElement;
	readonly isMounted: boolean;
	mount(): void;
	unmount(): void;
}

export interface OverlayMount {
	uiOverlayMount: UIOverlayMount;
	editorOverlayMount: EditorOverlayMount;
}
