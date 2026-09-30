/// <reference path="./CloseWatcher.d.ts" />
import { dataAnchorName } from "@rangex/core";
import {
	addERClass,
	forceReflowWithoutTransition,
	removeERClass,
} from "#utilities";
import type {
	AnchoredOverlayController,
	ApplyAnchorPositionParams,
	CreateAnchoredOverlayControllerParams,
	CreateCloseWatcherParams,
	CreatePopoverOverlayControllerParams,
	HideParams,
	PopoverOverlayController,
	RegisterLightDismissParams,
} from "./CreateOverlayController-types";

const hideAnchoredClass = "hide-anchored";
const anchoredOverlayClass = "anchored-overlay";
const popoverOverlayClass = "popover-overlay";

export const anchorPositionFields = [
	"position",
	"position-area",
	"top",
	"right",
	"bottom",
	"left",
	"width",
	"height",
	"align-self",
	"justify-self",
	"margin",
] as const;

const toAnchorPositionAttr = (property: string) => `data-er-${property}`;

/*
 * Writes the positioning values as `data-er-*` attributes, which the host stylesheet maps onto the matching
 * CSS properties via `attr()`. `clear` drops every previously set field first; otherwise unpassed fields persist.
 */
const applyAnchorPosition = ({
	element,
	positionAnchor,
	styleOptions,
}: ApplyAnchorPositionParams) => {
	const { clear, ...style } = styleOptions;

	if (clear) {
		for (const field of anchorPositionFields) {
			const attrName = toAnchorPositionAttr(field);

			element.removeAttribute(attrName);
		}
	}

	for (const [property, value] of Object.entries(style)) {
		const attrName = toAnchorPositionAttr(property);

		element.setAttribute(attrName, value);
	}

	const attrName = toAnchorPositionAttr("position-anchor");

	element.setAttribute(attrName, positionAnchor);
};

const registerLightDismiss = ({
	element,
	exemptNodes,
	isOpen,
	hide,
	signal,
}: RegisterLightDismissParams) => {
	const onPointerUp = (event: PointerEvent) => {
		if (!isOpen()) {
			return;
		}

		const path = event.composedPath();

		if (path.includes(element)) {
			return;
		}

		for (const node of exemptNodes) {
			if (path.includes(node)) {
				return;
			}
		}

		hide({});
	};

	document.addEventListener("pointerup", onPointerUp, { signal });
};

/**
 * Creates a `CloseWatcher` for one open session — closes on Escape or the platform's native
 * back gesture/button. Single-use: once it closes or is destroyed, a new one must be created
 * for the next open.
 */
const createCloseWatcher = ({
	hide,
	onEscape,
	signal,
}: CreateCloseWatcherParams) => {
	const watcher = new CloseWatcher({ signal });

	watcher.addEventListener("close", () => {
		hide({});
		onEscape?.();
	});

	return watcher;
};

/**
 * Sets `element` up as a CSS-anchor-positioned overlay and returns `show`/`hide` to toggle it.
 */
export const createAnchoredOverlayController = ({
	element,
	options,
}: CreateAnchoredOverlayControllerParams): AnchoredOverlayController => {
	const { onToggle, lightDismiss, closeOnEscape, onEscape } = options;

	addERClass(element, anchoredOverlayClass, hideAnchoredClass);

	let isOpen = false;
	let closeWatcher: CloseWatcher | null = null;
	let anchorElement: HTMLElement | null = null;
	const exemptNodes = new Set<HTMLElement>();

	const hide = ({ instant = false }: HideParams) => {
		addERClass(element, hideAnchoredClass);
		closeWatcher?.destroy();
		closeWatcher = null;
		isOpen = false;
		onToggle?.(isOpen);

		// A detached anchor leaves nothing to transition from, so skip the animation.
		const anchorDetached = anchorElement !== null && !anchorElement.isConnected;

		anchorElement = null;

		if (instant || anchorDetached) {
			forceReflowWithoutTransition(element);
		}
	};

	const abortController = new AbortController();

	if (lightDismiss) {
		registerLightDismiss({
			element,
			exemptNodes,
			isOpen: () => isOpen,
			hide,
			signal: abortController.signal,
		});
	}

	const controller: AnchoredOverlayController = {
		get element() {
			return element;
		},

		get isOpen() {
			return isOpen;
		},

		get anchorElement() {
			return anchorElement;
		},

		show(anchor, styleOptions) {
			anchorElement = anchor;

			const anchorName = anchor.getAttribute(dataAnchorName);

			if (anchorName === null) {
				throw new Error(
					`Anchor element is missing the "${dataAnchorName}" attribute.`,
				);
			}

			applyAnchorPosition({
				element,
				positionAnchor: anchorName,
				styleOptions,
			});

			removeERClass(element, hideAnchoredClass);

			if (closeOnEscape) {
				closeWatcher?.destroy();

				closeWatcher = createCloseWatcher({
					hide,
					onEscape,
					signal: abortController.signal,
				});
			}

			isOpen = true;
			onToggle?.(isOpen);
		},

		hide,

		addExemptNode(node) {
			exemptNodes.add(node);
		},

		removeExemptNode(node) {
			exemptNodes.delete(node);
		},

		cleanup() {
			abortController.abort();
		},
	};

	return controller;
};

/**
 * Sets `element` up as a native-popover-backed overlay (always `popover="manual"`, so `isOpen`/
 * `onToggle` are driven synchronously from `show`/`hide` rather than the native `toggle` event,
 * which is dispatched after repaint and would otherwise lag a tick behind reality) and returns
 * `show`/`hide` to toggle it.
 */
export const createPopoverOverlayController = ({
	element,
	options,
}: CreatePopoverOverlayControllerParams): PopoverOverlayController => {
	const { onToggle, lightDismiss, closeOnEscape, onEscape } = options;

	element.setAttribute("popover", "manual");
	addERClass(element, popoverOverlayClass);

	let isOpen = false;
	let closeWatcher: CloseWatcher | null = null;
	let anchorElement: HTMLElement | null = null;
	const exemptNodes = new Set<HTMLElement>();

	const hide = ({ instant = false }: HideParams) => {
		if (!isOpen) {
			return;
		}

		element.hidePopover();
		closeWatcher?.destroy();
		closeWatcher = null;
		isOpen = false;
		onToggle?.(isOpen);

		// A detached anchor leaves nothing to transition from, so skip the animation.
		const anchorDetached = anchorElement !== null && !anchorElement.isConnected;

		anchorElement = null;

		if (instant || anchorDetached) {
			forceReflowWithoutTransition(element);
		}
	};

	const abortController = new AbortController();

	if (lightDismiss) {
		registerLightDismiss({
			element,
			exemptNodes,
			isOpen: () => isOpen,
			hide,
			signal: abortController.signal,
		});
	}

	const controller: PopoverOverlayController = {
		get element() {
			return element;
		},

		get isOpen() {
			return isOpen;
		},

		get anchorElement() {
			return anchorElement;
		},

		show(anchor, styleOptions) {
			anchorElement = anchor;

			applyAnchorPosition({
				element,
				positionAnchor: "auto",
				styleOptions,
			});

			// We must hide it before showing it again
			if (isOpen) {
				element.hidePopover();
			}

			element.showPopover({ source: anchor });

			if (closeOnEscape) {
				closeWatcher?.destroy();

				closeWatcher = createCloseWatcher({
					hide,
					onEscape,
					signal: abortController.signal,
				});
			}

			isOpen = true;
			onToggle?.(isOpen);
		},

		hide,

		addExemptNode(node) {
			exemptNodes.add(node);
		},

		removeExemptNode(node) {
			exemptNodes.delete(node);
		},

		cleanup() {
			abortController.abort();
		},
	};

	return controller;
};
