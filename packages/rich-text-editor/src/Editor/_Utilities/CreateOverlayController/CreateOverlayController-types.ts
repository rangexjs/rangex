export type OnAnchoredOverlayToggleFn = (isOpen: boolean) => void;

export interface AnchoredOverlayControllerOptions {
	onToggle?: OnAnchoredOverlayToggleFn;
}

export interface CreateAnchoredOverlayControllerParams {
	element: HTMLElement;
	options?: AnchoredOverlayControllerOptions;
}

export type AnchorPositionField =
	| "position"
	| "position-area"
	| "top"
	| "right"
	| "bottom"
	| "left"
	| "width"
	| "height"
	| "align-self"
	| "justify-self";

export type AnchorStyleOptions = Partial<
	Record<AnchorPositionField, string>
> & {
	clear?: boolean;
};

export interface AnchoredOverlayController {
	readonly element: HTMLElement;
	readonly isOpen: boolean;
	show(anchorElement: Element, styleOptions: AnchorStyleOptions): void;
	hide(): void;
}
