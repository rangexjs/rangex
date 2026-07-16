import type {
	OnVideoSwapCheckStateChangeFn,
	OnVideoSwapFn,
	VideoEmitSwapParams,
	VideoSwapCheckState,
	VideoSwapPopover,
} from "./VideoSwapPopoverController-types";

export class VideoSwapPopoverController {
	#popover: HTMLDivElement | null = null;
	#checkState: VideoSwapCheckState = { status: "idle" };

	#onSwapListeners: Set<OnVideoSwapFn> = new Set();
	#onCheckStateChangeListeners: Set<OnVideoSwapCheckStateChangeFn> = new Set();

	emitSwap(params: VideoEmitSwapParams) {
		for (const listener of this.#onSwapListeners) {
			listener(params);
		}
	}

	updateCheckState(state: VideoSwapCheckState) {
		this.#checkState = state;

		for (const listener of this.#onCheckStateChangeListeners) {
			listener(this.#checkState);
		}
	}

	onCheckStateChange(callback: OnVideoSwapCheckStateChangeFn) {
		this.#onCheckStateChangeListeners.add(callback);
		return () => this.#onCheckStateChangeListeners.delete(callback);
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

			updateCheckState: (state) => this.updateCheckState(state),

			onCheckStateChange: (callback) => this.onCheckStateChange(callback),
		};
	}
}
