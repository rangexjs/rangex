import type {
	AudioEmitSwapParams,
	AudioSwapPopover,
	OnAudioSwapFn,
} from "./AudioSwapPopoverController-types";

export class AudioSwapPopoverController {
	#popover: HTMLDivElement | null = null;

	#onSwapListeners: Set<OnAudioSwapFn> = new Set();

	emitSwap(params: AudioEmitSwapParams) {
		for (const listener of this.#onSwapListeners) {
			listener(params);
		}
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): AudioSwapPopover {
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
