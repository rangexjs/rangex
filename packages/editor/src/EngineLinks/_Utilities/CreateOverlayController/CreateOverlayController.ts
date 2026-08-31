import { dataAnchorName } from "rich-text-area";
import type {
	AnchoredOverlayController,
	AnchorStyleOptions,
	CreateAnchoredOverlayControllerParams,
	CreatePopoverOverlayControllerParams,
	PopoverOverlayController,
} from "./CreateOverlayController-types";

const hideAnchoredClass = "hide-anchored";

/**
 * Sets `element` up as a CSS-anchor-positioned overlay and returns `show`/`hide` to toggle it.
 */
export const createAnchoredOverlayController = ({
	element,
	options = {},
}: CreateAnchoredOverlayControllerParams): AnchoredOverlayController => {
	const { onToggle } = options;

	element.classList.add(hideAnchoredClass);
	element.style.setProperty("position-visibility", "anchor-valid");

	let isOpen = false;

	return {
		get element() {
			return element;
		},

		get isOpen() {
			return isOpen;
		},

		show: (anchorElement, { clear, ...style }: AnchorStyleOptions) => {
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
			isOpen = true;
			onToggle?.(isOpen);
		},

		hide: () => {
			element.classList.add(hideAnchoredClass);
			isOpen = false;
			onToggle?.(isOpen);
		},
	};
};

/**
 * Sets `element` up as a native-popover-backed overlay and returns `show`/`hide` to toggle it.
 */
export const createPopoverOverlayController = ({
	element,
	options,
}: CreatePopoverOverlayControllerParams): PopoverOverlayController => {
	const { onToggle, popover } = options;

	element.setAttribute("popover", popover);

	let isOpen = false;

	element.addEventListener("toggle", (event) => {
		isOpen = event.newState === "open";
		onToggle?.(isOpen);
	});

	return {
		get element() {
			return element;
		},

		get isOpen() {
			return isOpen;
		},

		show: (anchorElement, { clear, ...style }: AnchorStyleOptions) => {
			if (clear) {
				element.style.cssText = "";
			}

			for (const [property, value] of Object.entries(style)) {
				element.style.setProperty(property, value);
			}

			element.style.setProperty("position-anchor", "auto");

			// We must hide it before showing it again
			element.hidePopover();

			element.showPopover({ source: anchorElement });
		},

		hide: () => {
			if (isOpen) {
				element.hidePopover();
			}
		},
	};
};
