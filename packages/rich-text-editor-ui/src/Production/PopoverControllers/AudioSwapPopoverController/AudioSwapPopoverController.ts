import type {
	AudioEmitSwapParams,
	AudioSwapCheckState,
	AudioSwapPopover,
	OnAudioSwapCheckStateChangeFn,
	OnAudioSwapFn,
} from "./AudioSwapPopoverController-types";

export class AudioSwapPopoverController {
	#popover: HTMLDivElement | null = null;
	#checkState: AudioSwapCheckState = { status: "idle" };

	#onSwapListeners: Set<OnAudioSwapFn> = new Set();
	#onCheckStateChangeListeners: Set<OnAudioSwapCheckStateChangeFn> = new Set();

	emitSwap(params: AudioEmitSwapParams) {
		for (const listener of this.#onSwapListeners) {
			listener(params);
		}
	}

	updateCheckState(state: AudioSwapCheckState) {
		this.#checkState = state;

		for (const listener of this.#onCheckStateChangeListeners) {
			listener(this.#checkState);
		}
	}

	onCheckStateChange(callback: OnAudioSwapCheckStateChangeFn) {
		this.#onCheckStateChangeListeners.add(callback);
		return () => this.#onCheckStateChangeListeners.delete(callback);
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

			updateCheckState: (state) => this.updateCheckState(state),

			onCheckStateChange: (callback) => this.onCheckStateChange(callback),
		};
	}
}
