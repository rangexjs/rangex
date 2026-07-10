import type { ImagePopover } from "./ImagePopoverController-types";

export class ImagePopoverController {
	#popover: HTMLDivElement | null = null;

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): ImagePopover {
		const controller = this;

		return {
			get popover() {
				if (!controller.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return controller.#popover;
			},
		};
	}
}
