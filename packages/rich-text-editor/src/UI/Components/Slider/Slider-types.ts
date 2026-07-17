import type { JSX } from "solid-js";

export interface GetThumbPositionInPercentageProps {
	sliderTrack: HTMLDivElement;
	clientX: number;
}

export interface ManageThumbUpdateProps {
	clientX: number;
	sliderTrack: HTMLDivElement;
}

interface OnThumbChangeFnProps {
	position: number;
}

export type OnThumbChangeFn = (props: OnThumbChangeFnProps) => void;

export interface RenderChildrenFnProps {
	sliderAnchor: string;
}

export type RenderChildrenFn = (props: RenderChildrenFnProps) => JSX.Element;

export interface SliderProps {
	thumbColor: string;
	thumbSize: number;
	trackHeight: number;
	sliderTrackColor?: string;
	position: number;
	onThumbChange: OnThumbChangeFn;
	class?: string;
	renderChildren?: RenderChildrenFn;
}
