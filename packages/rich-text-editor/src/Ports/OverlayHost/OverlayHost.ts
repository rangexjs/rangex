import { createComponent } from "solid-js";
import { render } from "solid-js/web";
import type {
	InitializeOverlayHostParams,
	MountOverlayHostParams,
	MountOverlayHostResult,
} from "./OverlayHost-types";

/**
 * Hosts every "floating" element (popovers, anchored/abspos elements) an Adapter owns,
 * mounted into one DOM container shared by every feature on a given editor instance.
 * Each `mount()` call creates its own isolated element and Solid render root, so callers
 * never collide with one another — the returned `unmount()` is the only handle back to it,
 * and is the caller's responsibility to keep track of and call, at most once.
 */
export class OverlayHost {
	#container: HTMLElement | null = null;

	initialize({ container }: InitializeOverlayHostParams) {
		this.#container = container;
	}

	mount<Props extends object>({
		component,
		props,
	}: MountOverlayHostParams<Props>): MountOverlayHostResult {
		if (!this.#container) {
			throw new Error("OverlayHost hasn't been initialized yet.");
		}

		const element = document.createElement("div");
		this.#container.append(element);

		const dispose = render(() => createComponent(component, props), element);

		return {
			element,
			unmount: () => {
				dispose();
				element.remove();
			},
		};
	}
}
