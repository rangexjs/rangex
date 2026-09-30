import { addERClass, removeERClass } from "../ERClass";

/**
 * Forces a synchronous reflow while the element's CSS transitions are disabled, so a pending
 * transition (e.g. a fade-out) is skipped instead of animating.
 */
export const forceReflowWithoutTransition = (element: HTMLElement) => {
	addERClass(element, "disable-transition");
	element.offsetHeight;
	removeERClass(element, "disable-transition");
};
