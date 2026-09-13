/// <reference path="./CloseWatcher.d.ts" />
import { dataAnchorName } from "rich-text-area";
import { forceReflowWithoutTransition } from "#utilities";
import type {
	AnchoredOverlayController,
	CreateAnchoredOverlayControllerParams,
	CreateCloseWatcherParams,
	CreatePopoverOverlayControllerParams,
	HideParams,
	PopoverOverlayController,
	RegisterLightDismissParams,
} from "./CreateOverlayController-types";

const hideAnchoredClass = "hide-anchored";

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
const createCloseWatcher = ({ hide, signal }: CreateCloseWatcherParams) => {
	const watcher = new CloseWatcher({ signal });

	watcher.onclose = () => {
		hide({});
	};

	return watcher;
};

/**
 * Sets `element` up as a CSS-anchor-positioned overlay and returns `show`/`hide` to toggle it.
 */
export const createAnchoredOverlayController = ({
	element,
	options,
}: CreateAnchoredOverlayControllerParams): AnchoredOverlayController => {
	const { onToggle, lightDismiss, closeOnEscape } = options;

	element.classList.add(hideAnchoredClass);
	element.style.setProperty("position-visibility", "anchor-valid");

	let isOpen = false;
	let closeWatcher: CloseWatcher | null = null;
	const exemptNodes = new Set<HTMLElement>();

	const hide = ({ instant = false }: HideParams) => {
		element.classList.add(hideAnchoredClass);
		closeWatcher?.destroy();
		closeWatcher = null;
		isOpen = false;
		onToggle?.(isOpen);

		if (instant) {
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

		show(anchorElement, { clear, ...style }) {
			const anchorName = anchorElement.getAttribute(dataAnchorName);

			if (anchorName === null) {
				throw new Error(
					`Anchor element is missing the "${dataAnchorName}" attribute.`,
				);
			}

			if (clear) {
				element.style.cssText = "";
			}

			for (const [property, value] of Object.entries(style)) {
				element.style.setProperty(property, value);
			}

			element.style.setProperty("position-anchor", anchorName);
			element.classList.remove(hideAnchoredClass);

			if (closeOnEscape) {
				closeWatcher = createCloseWatcher({
					hide,
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
	const { onToggle, lightDismiss, closeOnEscape } = options;

	element.setAttribute("popover", "manual");

	let isOpen = false;
	let closeWatcher: CloseWatcher | null = null;
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

		if (instant) {
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

		show(anchorElement, { clear, ...style }) {
			if (clear) {
				element.style.cssText = "";
			}

			for (const [property, value] of Object.entries(style)) {
				element.style.setProperty(property, value);
			}

			element.style.setProperty("position-anchor", "auto");

			// We must hide it before showing it again
			if (isOpen) {
				element.hidePopover();
			}

			element.showPopover({ source: anchorElement });

			if (closeOnEscape) {
				closeWatcher = createCloseWatcher({
					hide,
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
