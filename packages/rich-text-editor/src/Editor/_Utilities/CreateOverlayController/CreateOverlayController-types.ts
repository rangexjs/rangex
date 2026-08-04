export interface CreateAnchoredOverlayControllerParams {
	element: HTMLElement;
}

export type AnchorPositionField =
	| "position"
	| "position-area"
	| "top"
	| "right"
	| "bottom"
	| "left"
	| "width"
	| "height";

export type AnchorStyleOptions = Partial<
	Record<AnchorPositionField, string>
> & {
	clear?: boolean;
};

export interface AnchoredOverlayController {
	show(anchorElement: Element, styleOptions: AnchorStyleOptions): void;
	hide(): void;
}
