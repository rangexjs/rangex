/**
 * Forces a synchronous reflow while the element's CSS transitions are disabled, so a pending
 * transition (e.g. a fade-out) is skipped instead of animating.
 */
export const forceReflowWithoutTransition = (element: HTMLElement) => {
	element.classList.add("disable-transition");
	element.offsetHeight;
	element.classList.remove("disable-transition");
};
