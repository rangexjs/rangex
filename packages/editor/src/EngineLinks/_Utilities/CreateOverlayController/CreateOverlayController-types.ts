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
	| "justify-self"
	| "margin";

export type AnchorStyleOptions = Partial<
	Record<AnchorPositionField, string>
> & {
	clear?: boolean;
};

export interface OverlayController {
	readonly element: HTMLElement;
	readonly isOpen: boolean;
	show(anchorElement: HTMLElement, styleOptions: AnchorStyleOptions): void;
	hide(): void;
}

export type OnAnchoredOverlayToggleFn = (isOpen: boolean) => void;

export interface AnchoredOverlayControllerOptions {
	onToggle?: OnAnchoredOverlayToggleFn;
}

export interface CreateAnchoredOverlayControllerParams {
	element: HTMLElement;
	options?: AnchoredOverlayControllerOptions;
}

export interface AnchoredOverlayController extends OverlayController {}

export type PopoverMode = "auto" | "manual" | "hint";

export type OnPopoverOverlayToggleFn = (isOpen: boolean) => void;

export interface PopoverOverlayControllerOptions {
	popover: PopoverMode;
	onToggle?: OnPopoverOverlayToggleFn;
}

export interface CreatePopoverOverlayControllerParams {
	element: HTMLElement;
	options: PopoverOverlayControllerOptions;
}

export interface PopoverOverlayController extends OverlayController {}
