import type {
	EmitSwapParams,
	ImageSwapPopover,
	OnSwapFn,
} from "./ImageSwapPopoverController-types";

export class ImageSwapPopoverController {
	#popover: HTMLDivElement | null = null;

	#onSwapListeners: Set<OnSwapFn> = new Set();

	emitSwap(params: EmitSwapParams) {
		for (const listener of this.#onSwapListeners) {
			listener(params);
		}
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): ImageSwapPopover {
		const controller = this;

		return {
			get popover() {
				if (!controller.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return controller.#popover;
			},

			onSwap: (callback) => {
				this.#onSwapListeners.add(callback);
				return () => this.#onSwapListeners.delete(callback);
			},
		};
	}
}
