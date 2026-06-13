import type { JSX } from "solid-js";
import type { HslFormat } from "../../Color";

export interface ThumbPosition {
	xPosition: number;
	yPosition: number;
}

export interface GetPositionFromSaturationLightnessProps {
	saturation: number;
	lightness: number;
}

export interface GetPositionFromSaturationLightnessReturn {
	xPosition: number;
	yPosition: number;
}

export interface GetHueThumbPositionProps {
	hue: number;
}

export interface GetAlphaThumbPositionProps {
	alpha: number;
}

export interface ManageColorUpdateProps {
	hsl: HslFormat;
}

export interface GetHorizontalThumbPositionProps {
	clientX: number;
	panelLeft: number;
	panelRight: number;
	panelWidth: number;
}

export interface GetVerticalThumbPositionProps {
	clientY: number;
	panelTop: number;
	panelBottom: number;
	panelHeight: number;
}

export interface GetThumbPositionInPercentageProps {
	panel: HTMLDivElement;
	clientX: number;
	clientY: number;
}

export interface GetThumbPositionInPercentageReturn {
	xPosition: number;
	yPosition: number;
}

export interface GetSaturationLightnessFromPositionProps {
	xPosition: number;
	yPosition: number;
}

export interface GetSaturationLightnessFromPositionReturn {
	saturation: number;
	lightness: number;
}

export interface GetPositionFromHSLReturn {
	panelThumbXPosition: number;
	panelThumbYPosition: number;
	hueThumbPosition: number;
}

export interface ManageThumbUpdateProps {
	clientX: number;
	clientY: number;
	panel: HTMLDivElement;
}

export interface OnColorChangeParams {
	hsl: HslFormat;
}

export type OnColorChangeFn = (params: OnColorChangeParams) => void;

export interface SpectrumColorProps {
	hsl: HslFormat;
	onColorChange: OnColorChangeFn;
	spectrumWidth: number;
	spectrumHeight: number;
	class?: string;
	style?: JSX.CSSProperties;
}
