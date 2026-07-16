import type {
	OnVideoSwapFn,
	VideoEmitSwapParams,
	VideoSwapPopover,
} from "./VideoSwapPopoverController-types";

export class VideoSwapPopoverController {
	#popover: HTMLDivElement | null = null;

	#onSwapListeners: Set<OnVideoSwapFn> = new Set();

	emitSwap(params: VideoEmitSwapParams) {
		for (const listener of this.#onSwapListeners) {
			listener(params);
		}
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): VideoSwapPopover {
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
