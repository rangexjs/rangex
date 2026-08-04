import { dataAnchorName } from "rich-text-area";
import type {
	AnchoredOverlayController,
	AnchorStyleOptions,
	CreateAnchoredOverlayControllerParams,
} from "./CreateOverlayController-types";

const hideAnchoredClass = "hide-anchored";

/**
 * Sets `element` up as a CSS-anchor-positioned overlay and returns `show`/`hide` to toggle it.
 */
export const createAnchoredOverlayController = ({
	element,
}: CreateAnchoredOverlayControllerParams): AnchoredOverlayController => {
	element.classList.add(hideAnchoredClass);

	return {
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
		},
		hide: () => {
			element.classList.add(hideAnchoredClass);
		},
	};
};
