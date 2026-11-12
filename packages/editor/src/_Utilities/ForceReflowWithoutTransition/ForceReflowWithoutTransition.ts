import { addERClass, removeERClass } from "../ERClass";

/**
 * Forces a synchronous reflow while the element's CSS transitions are disabled, so a pending
 * transition (e.g. a fade-out) is skipped instead of animating.
 */
export const forceReflowWithoutTransition = (element: HTMLElement) => {
	addERClass(element, "disable-transition");
	// oxlint-disable-next-line no-unused-expressions -- Reading offsetHeight forces a synchronous reflow
	element.offsetHeight;
	removeERClass(element, "disable-transition");
};
