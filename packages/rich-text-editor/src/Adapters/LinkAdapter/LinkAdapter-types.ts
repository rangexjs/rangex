import type {
	LinkDisplayText,
	LinkMode,
	LinkToggleButtons,
	LinkToolbarButtonState,
	LinkURL,
	LinkView,
} from "#ports";

export interface LinkAdapterConstructorParams {
	[index: string]: never;
}

export type LinkUpdateToolbarButtonFn = (value: LinkToolbarButtonState) => void;
export type LinkUpdateViewFn = (value: LinkView) => void;
export type LinkUpdateModeFn = (value: LinkMode) => void;
export type LinkUpdateDisplayTextFn = (value: LinkDisplayText) => void;
export type LinkUpdateURLFn = (value: LinkURL) => void;
export type LinkUpdateToggleButtonsFn = (value: LinkToggleButtons) => void;

export type LinkListenerOption =
	| { type: "toolbarButton"; callback: LinkUpdateToolbarButtonFn }
	| { type: "view"; callback: LinkUpdateViewFn }
	| { type: "mode"; callback: LinkUpdateModeFn }
	| { type: "displayText"; callback: LinkUpdateDisplayTextFn }
	| { type: "url"; callback: LinkUpdateURLFn }
	| { type: "toggleButtons"; callback: LinkUpdateToggleButtonsFn };

export type LinkUpdateListenerParams = LinkListenerOption & {
	operation: "add" | "delete";
};
