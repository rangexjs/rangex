export interface RegisterLightDismissParams {
	element: HTMLElement;
	getAnchor: () => HTMLElement | null;
	isOpen: () => boolean;
	hide: () => void;
	signal: AbortSignal;
}

export interface CreateCloseWatcherParams {
	hide: () => void;
	signal: AbortSignal;
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
	cleanup(): void;
}

export type OnAnchoredOverlayToggleFn = (isOpen: boolean) => void;

export interface AnchoredOverlayControllerOptions {
	lightDismiss: boolean;
	closeOnEscape: boolean;
	onToggle?: OnAnchoredOverlayToggleFn;
}

export interface CreateAnchoredOverlayControllerParams {
	element: HTMLElement;
	options: AnchoredOverlayControllerOptions;
}

export interface AnchoredOverlayController extends OverlayController {}

export type OnPopoverOverlayToggleFn = (isOpen: boolean) => void;

export interface PopoverOverlayControllerOptions {
	lightDismiss: boolean;
	closeOnEscape: boolean;
	onToggle?: OnPopoverOverlayToggleFn;
}

export interface CreatePopoverOverlayControllerParams {
	element: HTMLElement;
	options: PopoverOverlayControllerOptions;
}

export interface PopoverOverlayController extends OverlayController {}
