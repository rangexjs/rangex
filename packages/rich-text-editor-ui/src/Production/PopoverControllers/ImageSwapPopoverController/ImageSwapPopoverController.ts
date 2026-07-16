import type {
	EmitSwapParams,
	ImageSwapPopover,
	OnSwapCheckStateChangeFn,
	OnSwapFn,
	SwapCheckState,
} from "./ImageSwapPopoverController-types";

export class ImageSwapPopoverController {
	#popover: HTMLDivElement | null = null;
	#checkState: SwapCheckState = { status: "idle" };

	#onSwapListeners: Set<OnSwapFn> = new Set();
	#onCheckStateChangeListeners: Set<OnSwapCheckStateChangeFn> = new Set();

	emitSwap(params: EmitSwapParams) {
		for (const listener of this.#onSwapListeners) {
			listener(params);
		}
	}

	updateCheckState(state: SwapCheckState) {
		this.#checkState = state;

		for (const listener of this.#onCheckStateChangeListeners) {
			listener(this.#checkState);
		}
	}

	onCheckStateChange(callback: OnSwapCheckStateChangeFn) {
		this.#onCheckStateChangeListeners.add(callback);
		return () => this.#onCheckStateChangeListeners.delete(callback);
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

			updateCheckState: (state) => this.updateCheckState(state),

			onCheckStateChange: (callback) => this.onCheckStateChange(callback),
		};
	}
}
