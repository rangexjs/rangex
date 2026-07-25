import { createComponent } from "solid-js";
import { render } from "solid-js/web";
import type {
	RenderComponentParams,
	RenderComponentResult,
} from "./RenderComponent-types";

/**
 * Renders one framework-specific component directly into a caller-supplied container — no
 * extra wrapper element, no shared per-editor-instance container. This is the one seam that
 * would need to change if the UI layer ever swapped frameworks (e.g. React's
 * `createRoot(container).render(<App />)` in place of Solid's `render()` below); every caller
 * only ever sees `container`/`component`/`props` in, a `dispose` function out.
 */
export const renderComponent = <Props extends object>({
	container,
	component,
	props,
}: RenderComponentParams<Props>): RenderComponentResult => {
	const dispose = render(() => createComponent(component, props), container);

	return dispose;
};
