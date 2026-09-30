import type { anchorPositionFields } from "./CreateOverlayController";

export interface HideParams {
	instant?: boolean;
}

export type HideFn = (params: HideParams) => void;

export interface RegisterLightDismissParams {
	element: HTMLElement;
	exemptNodes: Set<HTMLElement>;
	isOpen: () => boolean;
	hide: HideFn;
	signal: AbortSignal;
}

export type OnEscapeFn = () => void;

export interface CreateCloseWatcherParams {
	hide: HideFn;
	onEscape?: OnEscapeFn;
	signal: AbortSignal;
}

export type AnchorPositionField = (typeof anchorPositionFields)[number];

export type AnchorPositionStyle = Partial<Record<AnchorPositionField, string>>;

export type AnchorStyleOptions = AnchorPositionStyle & {
	clear?: boolean;
};

export interface ApplyAnchorPositionParams {
	element: HTMLElement;
	positionAnchor: string;
	styleOptions: AnchorStyleOptions;
}

export interface OverlayController {
	readonly element: HTMLElement;
	readonly isOpen: boolean;
	readonly anchorElement: HTMLElement | null;
	show(anchorElement: HTMLElement, styleOptions: AnchorStyleOptions): void;
	hide: HideFn;
	addExemptNode(node: HTMLElement): void;
	removeExemptNode(node: HTMLElement): void;
	cleanup(): void;
}

export type OnAnchoredOverlayToggleFn = (isOpen: boolean) => void;

export interface AnchoredOverlayControllerOptions {
	lightDismiss: boolean;
	closeOnEscape: boolean;
	onToggle?: OnAnchoredOverlayToggleFn;
	onEscape?: OnEscapeFn;
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
	onEscape?: OnEscapeFn;
}

export interface CreatePopoverOverlayControllerParams {
	element: HTMLElement;
	options: PopoverOverlayControllerOptions;
}

export interface PopoverOverlayController extends OverlayController {}
